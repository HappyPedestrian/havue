# Changelog

## [1.0.0] (2025-03-28)

### Features

* **components**: 新增基于Vue3的组件。
* * **color-picker**: 颜色选择器。
* * **drag-and-drop**: 拖拽组件
* * **drag-and-scale**: 移动/缩放组件
* **directives**: 新增Vue3指令。
* * **right-click**: 鼠标右键。
* **solutions**: 一些有用的Javascript类
* * **bc-connect**: 用于浏览器tab间的广播通信。
* * **ws-video-manager**: 接受 WebSocket传递的 Fmp4 视频数据进行播放。
* **hooks**: 封装的Vue3 hooks
* * **use-full-screen-adapt**: 页面全屏适配，基于rem。
* * **use-gesture-2-mouse**: 识别手势，转换为鼠标操作。
* * **use-ws-video**: 对**ws-video-manager**进行封装的hook。
* **tools**: 一些有用的工具函数。

## [1.1.0] (2025-04-02)

### BREAKING CHANGES

* 重命名组件样式类名，移除单文件组件SFC的scoped属性。

## [1.1.1] (2025-04-08)

### Bug Fixes

* **ws-video-manager**: MediaSource SourceBuffer有时不能直接使用Websocket传递的视频数据，通过Mp4box.js处理后，再添加到SourceBuffer中

### Features

* **ws-video-manager**: 支持音频轨处理

## [1.1.2] (2025-04-15)

### Bug Fixes

* **color-picker**: 将默认颜色更改为'#FFFFFF'，并调整事件绑定。
* **drag-and-drop**: 修复Draggable 和 Droppable从移除后，manager中绑定的事件并没有移除的问题
* **drag-and-scale**: 调整事件绑定。
* **bc-connect**: 修正了bc-connect在调用close方法后没有重置相关状态的错误。

### Features

* **vitest**: 增加 vitest。

## [1.2.0] (2025-09-09)

### Features

* **color-picker**: 新增HvColorPickerNormal组件，HvColorPicker支持disabled属性。
* **ip-input**: 增加IP地址输入组件。
* **drag-and-drop**: HvDroppable 增加 disabled 属性支持。
* **drag-and-scale**: 文档增加自定义样式示例。

### Bug Fixes

* **drag-and-drop**: 修复Draggable组件'drag-item'插槽命名与文档不一致，导致无法使用的问题。
* **tools/strSortFn**: 修正了中文字符在文本排序时排在英文大写字母之前的问题。

### Refactors

* **drag-and-scale**: 规范组件css变量名称。

## [1.2.1] (2025-12-11)

### Bug Fixes

* **color-picker**: HvColorPickerNormal 输入区域样式调整，增加透明度输入框宽度，输入框清空时，默认值为0。
* **drag-and-drop**: 修复在鼠标事件触发不频繁，或者Draggable与Droppable距离较近时，拖动过Draggable到Droppalbe后，Droppable未重置Draggalbe是否拖入的状态，导致下一次拖动，不会触发enter事件的问题。
* **drag-and-drop**: 当immediate属性为'all'时，拖动在鼠标移动后触发，避免无法触发click。
* **drag-and-scale**: 修复drag-and-scale未正确卸载鼠标/触控事件，导致频繁触发mousemove或touchmove的问题，以及使用requestAnimationFrame优化move事件触发频率

### Refactors

* **right-click**: 重构right-click自定义指令实现方式。
