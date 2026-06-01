declare global {
  /**
   *
   * @param callback CALLBACK(Function) The function that will be called when the current 'stack' of Sheet Worker Scripts completes.
   * @returns {void}
   * @example
   * This function is intended to be called prior to setWithWorker. The callback function will be called only once.
   * var myCharacter = ...,
   *     mySourceAttr = findObjs({ type: 'attribute', characterid: myCharacter.id, name: 'mySourceAttribute' })[0];
   *
   * onSheetWorkerCompleted(function() {
   *     var calculatedAttr = findObjs({ type: 'attribute', characterid: myCharacter.id, name: 'myCalculatedAttribute' })[0];
   *     // do something with calculatedAttr.get('current');
   * });
   * mySourceAttr.setWithWorker({ current: 5 });
   */
  function onSheetWorkerCompleted(callback: () => void): void;
}