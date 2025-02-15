const commonSkillAliases = {
  'js': 'javascript',
  'ts': 'typescript',
  'react.js': 'react',
  'react js': 'react',
  'node.js': 'node',
  'node js': 'node',
  // Add more aliases as needed
};

function normalizeSkill(skill) {
  const normalized = skill.toLowerCase().trim();
  return commonSkillAliases[normalized] || normalized;
}

module.exports = { normalizeSkill }; 