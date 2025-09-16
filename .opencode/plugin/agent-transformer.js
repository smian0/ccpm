/**
 * OpenCode Plugin: Agent Transformer
 * Dynamically transforms Claude agent files to OpenCode format on-the-fly
 */

import { readFile } from 'fs/promises';
import { basename, join, dirname } from 'path';

// Tool name mapping from Claude to OpenCode format
const TOOL_MAPPING = {
  'Glob': 'glob',
  'Grep': 'grep', 
  'LS': 'ls',
  'Read': 'view',
  'Write': 'write',
  'Edit': 'edit',
  'MultiEdit': 'edit',
  'Task': 'agent',
  'Agent': 'agent',
  'Bash': 'bash',
  'WebFetch': 'fetch',
  'TodoWrite': 'todo',
  'WebSearch': 'websearch',
  'Search': 'search'
};

/**
 * Parse YAML frontmatter (simple implementation)
 */
function parseYAML(yamlStr) {
  const result = {};
  const lines = yamlStr.trim().split('\n');
  
  for (const line of lines) {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      
      if (key.trim() === 'tools') {
        result[key.trim()] = value.split(',').map(t => t.trim());
      } else {
        result[key.trim()] = value;
      }
    }
  }
  
  return result;
}

/**
 * Transform Claude frontmatter to OpenCode format
 */
function transformFrontmatter(claudeFM) {
  // Extract clean description from first sentence, removing examples and markup
  let cleanDescription = 'Transformed agent';
  if (claudeFM.description) {
    cleanDescription = claudeFM.description
      .split('\n')[0]                           // Take first line
      .split('.')[0] + '.'                     // Take first sentence
      .replace(/<[^>]*>/g, '')                 // Remove HTML/XML tags
      .replace(/\s+/g, ' ')                    // Normalize whitespace
      .trim();
    
    // Fallback if description becomes too short
    if (cleanDescription.length < 20) {
      cleanDescription = claudeFM.name ? `${claudeFM.name} agent for specialized tasks` : 'Transformed agent';
    }
  }
  
  return {
    description: cleanDescription,
    mode: claudeFM.mode || 'all'
  };
}

/**
 * Serialize object to YAML format
 */
function stringifyYAML(obj) {
  let result = '';
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      result += `${key}:\n`;
      for (const [subKey, subValue] of Object.entries(value)) {
        result += `  ${subKey}: ${subValue}\n`;
      }
    } else if (Array.isArray(value)) {
      result += `${key}: [${value.join(', ')}]\n`;
    } else {
      result += `${key}: ${value}\n`;
    }
  }
  
  return result;
}

/**
 * Transform agent content from Claude to OpenCode format
 */
function transformAgent(content) {
  try {
    // Split frontmatter and body
    const parts = content.split('---');
    if (parts.length < 3) {
      console.warn('[Agent Transformer] Invalid agent file format, missing frontmatter');
      return content;
    }
    
    const frontmatterStr = parts[1];
    const body = parts.slice(2).join('---');
    
    // Parse and transform frontmatter
    const claudeFM = parseYAML(frontmatterStr);
    const opencodeFM = transformFrontmatter(claudeFM);
    
    // Transform body content
    const transformedBody = body
      .replace(/\.claude\//g, '.opencode/')
      .replace(/Task tool/g, 'agent tool')
      .replace(/Claude Code/g, 'OpenCode');
    
    // Reconstruct file
    const result = `---\n${stringifyYAML(opencodeFM)}---${transformedBody}`;
    
    console.log(`[Agent Transformer] Transformed ${claudeFM.name || 'unknown'} agent`);
    return result;
    
  } catch (error) {
    console.error('[Agent Transformer] Transform error:', error);
    return content; // Return original on error
  }
}

/**
 * Check if path is requesting an OpenCode agent
 */
function isOpenCodeAgentPath(filePath) {
  return filePath && (
    filePath.includes('.opencode/agent/') ||
    filePath.includes('/.opencode/agent/') ||
    filePath.endsWith('.opencode/agent')
  );
}

/**
 * Get corresponding Claude agent path
 */
function getClaudeAgentPath(opencodePath, directory) {
  const filename = basename(opencodePath);
  const projectRoot = dirname(directory); // Go up one level from .opencode to project root
  return join(projectRoot, '.claude/agents', filename);
}

/**
 * Plugin export - Handles agent transformation
 */
export const AgentTransformer = async ({ project, client, $, directory, worktree }) => {
  console.log('[Agent Transformer] Plugin initializing');
  console.log(`[Agent Transformer] Working directory: ${directory}`);
  
  // Detect and log agents from .claude directory
  try {
    const projectRoot = dirname(directory); // Go up one level from .opencode to project root
    const claudeAgentsPath = join(projectRoot, '.claude/agents');
    const { readdirSync } = await import('fs');
    const agents = readdirSync(claudeAgentsPath).filter(file => file.endsWith('.md'));
    console.log(`[Agent Transformer] Claude agents detected: ${agents.join(', ')}`);
  } catch (error) {
    console.log(`[Agent Transformer] No Claude agents found: ${error.message}`);
  }
  
  return {
    /**
     * Hook into tool execution to transform agent files on-the-fly
     */
    "tool.execute.before": async (input, output) => {
      try {
        // Intercept view/read tool calls for agent files
        if (input.tool === 'view' && output.args?.filePath && isOpenCodeAgentPath(output.args.filePath)) {
          const opencodePath = output.args.filePath;
          const claudePath = getClaudeAgentPath(opencodePath, directory);
          
          console.log(`[Agent Transformer] Intercepting ${input.tool} tool: ${opencodePath}`);
          console.log(`[Agent Transformer] Redirecting to: ${claudePath}`);
          
          try {
            const claudeContent = await readFile(claudePath, 'utf8');
            const transformedContent = transformAgent(claudeContent);
            
            // Modify args to return transformed content
            output.args = {
              ...output.args,
              filePath: claudePath,
              _transformedContent: transformedContent
            };
            
            console.log(`[Agent Transformer] Successfully intercepted and transformed`);
            
          } catch (readError) {
            console.error(`[Agent Transformer] Could not read Claude agent: ${claudePath}`, readError);
          }
        }
        
      } catch (error) {
        console.error('[Agent Transformer] Plugin error:', error);
      }
      
      // Return undefined to let default behavior continue
      return undefined;
    }
  };
};