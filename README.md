### 自定义loader
#### 详情可参考bin/replace-html-loader.js
```
module.exports = function (source) {
  ...
  return source;
}
```
> (1) source代表截获的文件内容, loader是从右向左 从下至上运行
> (2) 方法内部可以获取this, this代表webpack上下文


### 自定义plugin
#### 详情可以参考bin/console-plugin.js

```
// 1. 一个JavaScript命名函数
// 2. 在插件函数的 prototype 上定义一个apply方法
class ConsolePlugin {
  // 3. apply 中有一个 compiler 形参
  apply(compiler){
    console.log('插件执行了');
    // 4. 通过compiler对象可以注册对应的事件，全部的钩子都可以使用
    // 注册一个编译完成的钩子， 一般需要将插件名作为事件名即可
    compiler.hooks.done.tap('ConsolePlugin', (stats) => {
      console.log('整个webpack打包结束了');
    })

    compiler.hooks.emit.tap('ConsolePlugin', (compilation) => {
      console.log('触发emit方法');
    })
  }
}

module.exports = ConsolePlugin;
```


>插件是 webpack 生态系统的重要组成部分，为社区用户提供了一种强大方式来直接触及 webpack 的编译过程(compilation process)。
>插件能够 钩入(hook) 到在每个编译(compilation)中触发的所有关键事件。
>在编译的每一步，插件都具备完全访问 compiler 对象的能力，如果情况合适，还可以访问当前 compilation 对象。

### Tapable钩子列表

|  钩子名                    | 执行方式    |   要点     |
|  ----                     | ----       |  ------   |
| SyncHook                  | 同步串行    |   不关心监听函数的返回值        | 
| SyncBailHook              | 同步串行    |   只要监听函数中有一个函数的返回值不为null,则跳过剩下所有的辑        |
| SyncWaterfallHook         | 同步串行    |     上一个监听函数的返回值可以传给下一个监听函数      |
| SyncLoopHook	            | 同步循环    |   当监听函数被触发的时候,如果该监听函数返回true时则这个监听函数会反复执行,如果返回undefined则表示退出循环        |
| AsyncParallelHook         | 异步并发    |  不关心监听函数的返回值         |
| AsyncParallelBailHook     | 异步并发    |   只要监听函数的返回值不为null,就会忽略后面的监听函数执行,直接跳跃到callAsync等触发函数绑定的回调函数,然后执行这个被绑定的回调函数        |
| AsyncSeriesHook           | 异步串行    |  不关心callback的参数         |
| AsyncSeriesBailHook       | 异步串行    |  callback()的参数不为null,就会直接执行callAsync等触发函数绑定的回调函数        |
| AsyncSeriesWaterfalllHook | 异步串行    |  上一个监听函数中的callback(err,data)的第二个参数,可以作为下一个监听函数的参数        |

### 常见的Compiler钩子

```
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {
      shouldEmit: new SyncBailHook(["compilation"]),//此时返回 true/false。
      done: new AsyncSeriesHook(["stats"]),//编译(compilation)完成。
      additionalPass: new AsyncSeriesHook([]),
      beforeRun: new AsyncSeriesHook(["compiler"]),//compiler.run() 执行之前，添加一个钩子。
      run: new AsyncSeriesHook(["compiler"]),//开始读取 records 之前，钩入(hook into) compiler。
      emit: new AsyncSeriesHook(["compilation"]),//输出到dist目录
      afterEmit: new AsyncSeriesHook(["compilation"]),//生成资源到 output 目录之后。

      thisCompilation: new SyncHook(["compilation", "params"]),//触发 compilation 事件之前执行（查看下面的 compilation）。
      compilation: new SyncHook(["compilation", "params"]),//编译(compilation)创建之后，执行插件。
      normalModuleFactory: new SyncHook(["normalModuleFactory"]),//NormalModuleFactory 创建之后，执行插件。
      contextModuleFactory: new SyncHook(["contextModulefactory"]),//ContextModuleFactory 创建之后，执行插件。

      beforeCompile: new AsyncSeriesHook(["params"]),//编译(compilation)参数创建之后，执行插件。
      compile: new SyncHook(["params"]),//一个新的编译(compilation)创建之后，钩入(hook into) compiler。
      make: new AsyncParallelHook(["compilation"]),//从入口分析依赖以及间接依赖模块
      afterCompile: new AsyncSeriesHook(["compilation"]),//完成构建，缓存数据

      watchRun: new AsyncSeriesHook(["compiler"]),//监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前。
      failed: new SyncHook(["error"]),//编译(compilation)失败。
      invalid: new SyncHook(["filename", "changeTime"]),//监听模式下，编译无效时。
      watchClose: new SyncHook([]),//监听模式停止。
    }
  }
}
```
