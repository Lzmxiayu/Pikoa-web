// import pluginVue from 'eslint-plugin-vue'
// import vueTsEslintConfig from '@vue/eslint-config-typescript'
// import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// export default [
//   {
//     name: 'app/files-to-lint',
//     files: ['**/*.{ts,mts,tsx,vue}'],
//   },

//   {
//     name: 'app/files-to-ignore',
//     ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
//   },

//   ...pluginVue.configs['flat/essential'],
//   ...vueTsEslintConfig(),
//   skipFormatting,
// ]
module.exports = {
  // ...其他配置
  plugins: ['vue'],
  rules: {
    // ...其他规则
    'vue/no-undef-properties': 'off',
    'no-undef': 'off',
    'vue/valid-define-props': 'error',
  },
  // ...其他配置
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  // 关闭ESLint的严格模式检查
  lintOnSave: false,
}
