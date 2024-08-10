module.exports = {
  // Babel的预设列表，用于确定使用哪些插件和预处理器
  presets: [
    // 导入Vue CLI的Babel预设，这是为Vue项目准备的预设
    '@vue/cli-plugin-babel/preset'
  ],
  // Babel的环境配置，允许针对不同的环境（如开发环境、生产环境）设置不同的配置
  'env': {
    // 开发环境的Babel配置
    'development': {
      // 开发环境特定的插件列表
      'plugins': ['dynamic-import-node']
    }
  }
}
