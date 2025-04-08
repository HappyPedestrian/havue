# Changelog

## [1.0.0] (2025-03-28)

### Features

* **components**: Some Vue3 componets.
* * **color-picker**: Color picker component.
* * **drag-and-drop**: Draggalbe component and Droppable component.
* * **drag-and-scale**: Component for drag and zoom a element in container.
* **directives**: Some Vue3 directives.
* * **right-click**: Directive for mouse right click.
* **solutions**: Some helpful javascript class.
* * **bc-connect**: Create Broadcast Channel connect between tabs.
* * **ws-video-manager**: Play and manage WebSocket Fmp4 video.
* **hooks**: Vue3 Hooks for some solutions.
* * **use-full-screen-adapt**: Use rem to Resize page.
* * **use-gesture-2-mouse**: Recognize gesture as mouse operation.
* * **use-ws-video**: Hook for use **ws-video-manager**.
* **tools**: Some helpful javascript utils.

## [1.1.0] (2025-04-02)

### BREAKING CHANGES

* Rename components' class name, and delete scope attribute of SFC style tag.

## [1.1.1] (2025-04-08)

### Bug Fixes

* **ws-video-manager**: Fix MediaSource SourceBuffer can't use Websocket data directively some time,
  use Mp4box.js deal with before append to SourceBuffer.

### Features

* **ws-video-manager**: Support audio track play.
