#### 0.0.9
* Added new optional parameter `request_options`. JSON stringified options for GhostInspector API. See https://ghostinspector.com/docs/api/suites/#execute for more information.

#### 0.0.8
* Switched from `request` to `anxios` npm module.
* Solved request's timeout issue.
* Added JSON stringified GhostInspector response to output (`content`).
* Added ability to fail action when unit tests does not pass if option `fail_if_not_pass` is provided.