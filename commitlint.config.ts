export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']],
        'scope-empty': [2, 'never'],
        'scope-case': [2, 'always', 'kebab-case'],
        'subject-case': [2, 'always', 'lower-case'],
        'header-pattern': [2, 'always', '^(feat|fix|docs|style|refactor|test|chore)\\([a-z]+(?:-[a-z]+)*\\): [a-z].+$']
    }
};