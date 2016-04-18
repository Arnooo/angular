'use strict';"use strict";
var o = require('../output/output_ast');
var constants_1 = require('./constants');
var lifecycle_hooks_1 = require('angular2/src/core/metadata/lifecycle_hooks');
var STATE_IS_NEVER_CHECKED = o.THIS_EXPR.prop('cdState').identical(constants_1.ChangeDetectorStateEnum.NeverChecked);
var NOT_THROW_ON_CHANGES = o.not(constants_1.DetectChangesVars.throwOnChange);
function bindDirectiveDetectChangesLifecycleCallbacks(directiveAst, directiveInstance, compileElement) {
    var view = compileElement.view;
    var detectChangesInInputsMethod = view.detectChangesInInputsMethod;
    var lifecycleHooks = directiveAst.directive.lifecycleHooks;
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.OnChanges) !== -1 && directiveAst.inputs.length > 0) {
        detectChangesInInputsMethod.addStmt(new o.IfStmt(constants_1.DetectChangesVars.changes.notIdentical(o.NULL_EXPR), [directiveInstance.callMethod('ngOnChanges', [constants_1.DetectChangesVars.changes]).toStmt()]));
    }
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.OnInit) !== -1) {
        detectChangesInInputsMethod.addStmt(new o.IfStmt(STATE_IS_NEVER_CHECKED.and(NOT_THROW_ON_CHANGES), [directiveInstance.callMethod('ngOnInit', []).toStmt()]));
    }
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.DoCheck) !== -1) {
        detectChangesInInputsMethod.addStmt(new o.IfStmt(NOT_THROW_ON_CHANGES, [directiveInstance.callMethod('ngDoCheck', []).toStmt()]));
    }
}
exports.bindDirectiveDetectChangesLifecycleCallbacks = bindDirectiveDetectChangesLifecycleCallbacks;
function bindDirectiveAfterContentLifecycleCallbacks(directiveMeta, directiveInstance, compileElement) {
    var view = compileElement.view;
    var lifecycleHooks = directiveMeta.lifecycleHooks;
    var afterContentLifecycleCallbacksMethod = view.afterContentLifecycleCallbacksMethod;
    afterContentLifecycleCallbacksMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.AfterContentInit) !== -1) {
        afterContentLifecycleCallbacksMethod.addStmt(new o.IfStmt(STATE_IS_NEVER_CHECKED, [directiveInstance.callMethod('ngAfterContentInit', []).toStmt()]));
    }
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.AfterContentChecked) !== -1) {
        afterContentLifecycleCallbacksMethod.addStmt(directiveInstance.callMethod('ngAfterContentChecked', []).toStmt());
    }
}
exports.bindDirectiveAfterContentLifecycleCallbacks = bindDirectiveAfterContentLifecycleCallbacks;
function bindDirectiveAfterViewLifecycleCallbacks(directiveMeta, directiveInstance, compileElement) {
    var view = compileElement.view;
    var lifecycleHooks = directiveMeta.lifecycleHooks;
    var afterViewLifecycleCallbacksMethod = view.afterViewLifecycleCallbacksMethod;
    afterViewLifecycleCallbacksMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.AfterViewInit) !== -1) {
        afterViewLifecycleCallbacksMethod.addStmt(new o.IfStmt(STATE_IS_NEVER_CHECKED, [directiveInstance.callMethod('ngAfterViewInit', []).toStmt()]));
    }
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.AfterViewChecked) !== -1) {
        afterViewLifecycleCallbacksMethod.addStmt(directiveInstance.callMethod('ngAfterViewChecked', []).toStmt());
    }
}
exports.bindDirectiveAfterViewLifecycleCallbacks = bindDirectiveAfterViewLifecycleCallbacks;
function bindDirectiveDestroyLifecycleCallbacks(directiveMeta, directiveInstance, compileElement) {
    var onDestroyMethod = compileElement.view.destroyMethod;
    onDestroyMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
    if (directiveMeta.lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.OnDestroy) !== -1) {
        onDestroyMethod.addStmt(directiveInstance.callMethod('ngOnDestroy', []).toStmt());
    }
}
exports.bindDirectiveDestroyLifecycleCallbacks = bindDirectiveDestroyLifecycleCallbacks;
function bindPipeDestroyLifecycleCallbacks(pipeMeta, directiveInstance, view) {
    var onDestroyMethod = view.destroyMethod;
    if (pipeMeta.lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.OnDestroy) !== -1) {
        onDestroyMethod.addStmt(directiveInstance.callMethod('ngOnDestroy', []).toStmt());
    }
}
exports.bindPipeDestroyLifecycleCallbacks = bindPipeDestroyLifecycleCallbacks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZWN5Y2xlX2JpbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtV0d3Z09zSWMudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL2xpZmVjeWNsZV9iaW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVksQ0FBQyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDMUMsMEJBQXlELGFBQWEsQ0FBQyxDQUFBO0FBQ3ZFLGdDQUE2Qiw0Q0FBNEMsQ0FBQyxDQUFBO0FBTzFFLElBQUksc0JBQXNCLEdBQ3RCLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxtQ0FBdUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoRixJQUFJLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsNkJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFbEUsc0RBQ0ksWUFBMEIsRUFBRSxpQkFBK0IsRUFBRSxjQUE4QjtJQUM3RixJQUFJLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDO0lBQy9CLElBQUksMkJBQTJCLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDO0lBQ25FLElBQUksY0FBYyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO0lBQzNELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsZ0NBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlGLDJCQUEyQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQzVDLDZCQUFpQixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUNuRCxDQUFDLGlC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QyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRSxlQUFlLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNwRixDQUFDO0FBQ0gsQ0FBQztBQU5lLHlDQUFpQyxvQ0FNaEQsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtEZXRlY3RDaGFuZ2VzVmFycywgQ2hhbmdlRGV0ZWN0b3JTdGF0ZUVudW19IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7TGlmZWN5Y2xlSG9va3N9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL21ldGFkYXRhL2xpZmVjeWNsZV9ob29rcyc7XG5cbmltcG9ydCB7Q29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLCBDb21waWxlUGlwZU1ldGFkYXRhfSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCB7RGlyZWN0aXZlQXN0fSBmcm9tICcuLi90ZW1wbGF0ZV9hc3QnO1xuaW1wb3J0IHtDb21waWxlRWxlbWVudH0gZnJvbSAnLi9jb21waWxlX2VsZW1lbnQnO1xuaW1wb3J0IHtDb21waWxlVmlld30gZnJvbSAnLi9jb21waWxlX3ZpZXcnO1xuXG52YXIgU1RBVEVfSVNfTkVWRVJfQ0hFQ0tFRCA9XG4gICAgby5USElTX0VYUFIucHJvcCgnY2RTdGF0ZScpLmlkZW50aWNhbChDaGFuZ2VEZXRlY3RvclN0YXRlRW51bS5OZXZlckNoZWNrZWQpO1xudmFyIE5PVF9USFJPV19PTl9DSEFOR0VTID0gby5ub3QoRGV0ZWN0Q2hhbmdlc1ZhcnMudGhyb3dPbkNoYW5nZSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kRGlyZWN0aXZlRGV0ZWN0Q2hhbmdlc0xpZmVjeWNsZUNhbGxiYWNrcyhcbiAgICBkaXJlY3RpdmVBc3Q6IERpcmVjdGl2ZUFzdCwgZGlyZWN0aXZlSW5zdGFuY2U6IG8uRXhwcmVzc2lvbiwgY29tcGlsZUVsZW1lbnQ6IENvbXBpbGVFbGVtZW50KSB7XG4gIHZhciB2aWV3ID0gY29tcGlsZUVsZW1lbnQudmlldztcbiAgdmFyIGRldGVjdENoYW5nZXNJbklucHV0c01ldGhvZCA9IHZpZXcuZGV0ZWN0Q2hhbmdlc0luSW5wdXRzTWV0aG9kO1xuICB2YXIgbGlmZWN5Y2xlSG9va3MgPSBkaXJlY3RpdmVBc3QuZGlyZWN0aXZlLmxpZmVjeWNsZUhvb2tzO1xuICBpZiAobGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5PbkNoYW5nZXMpICE9PSAtMSAmJiBkaXJlY3RpdmVBc3QuaW5wdXRzLmxlbmd0aCA+IDApIHtcbiAgICBkZXRlY3RDaGFuZ2VzSW5JbnB1dHNNZXRob2QuYWRkU3RtdChuZXcgby5JZlN0bXQoXG4gICAgICAgIERldGVjdENoYW5nZXNWYXJzLmNoYW5nZXMubm90SWRlbnRpY2FsKG8uTlVMTF9FWFBSKSxcbiAgICAgICAgW2RpcmVjdGl2ZUluc3RhbmNlLmNhbGxNZXRob2QoJ25nT25DaGFuZ2VzJywgW0RldGVjdENoYW5nZXNWYXJzLmNoYW5nZXNdKS50b1N0bXQoKV0pKTtcbiAgfVxuICBpZiAobGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5PbkluaXQpICE9PSAtMSkge1xuICAgIGRldGVjdENoYW5nZXNJbklucHV0c01ldGhvZC5hZGRTdG10KFxuICAgICAgICBuZXcgby5JZlN0bXQoU1RBVEVfSVNfTkVWRVJfQ0hFQ0tFRC5hbmQoTk9UX1RIUk9XX09OX0NIQU5HRVMpLFxuICAgICAgICAgICAgICAgICAgICAgW2RpcmVjdGl2ZUluc3RhbmNlLmNhbGxNZXRob2QoJ25nT25Jbml0JywgW10pLnRvU3RtdCgpXSkpO1xuICB9XG4gIGlmIChsaWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLkRvQ2hlY2spICE9PSAtMSkge1xuICAgIGRldGVjdENoYW5nZXNJbklucHV0c01ldGhvZC5hZGRTdG10KG5ldyBvLklmU3RtdChcbiAgICAgICAgTk9UX1RIUk9XX09OX0NIQU5HRVMsIFtkaXJlY3RpdmVJbnN0YW5jZS5jYWxsTWV0aG9kKCduZ0RvQ2hlY2snLCBbXSkudG9TdG10KCldKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmREaXJlY3RpdmVBZnRlckNvbnRlbnRMaWZlY3ljbGVDYWxsYmFja3MoZGlyZWN0aXZlTWV0YTogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlSW5zdGFuY2U6IG8uRXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVFbGVtZW50OiBDb21waWxlRWxlbWVudCkge1xuICB2YXIgdmlldyA9IGNvbXBpbGVFbGVtZW50LnZpZXc7XG4gIHZhciBsaWZlY3ljbGVIb29rcyA9IGRpcmVjdGl2ZU1ldGEubGlmZWN5Y2xlSG9va3M7XG4gIHZhciBhZnRlckNvbnRlbnRMaWZlY3ljbGVDYWxsYmFja3NNZXRob2QgPSB2aWV3LmFmdGVyQ29udGVudExpZmVjeWNsZUNhbGxiYWNrc01ldGhvZDtcbiAgYWZ0ZXJDb250ZW50TGlmZWN5Y2xlQ2FsbGJhY2tzTWV0aG9kLnJlc2V0RGVidWdJbmZvKGNvbXBpbGVFbGVtZW50Lm5vZGVJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVFbGVtZW50LnNvdXJjZUFzdCk7XG4gIGlmIChsaWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLkFmdGVyQ29udGVudEluaXQpICE9PSAtMSkge1xuICAgIGFmdGVyQ29udGVudExpZmVjeWNsZUNhbGxiYWNrc01ldGhvZC5hZGRTdG10KG5ldyBvLklmU3RtdChcbiAgICAgICAgU1RBVEVfSVNfTkVWRVJfQ0hFQ0tFRCwgW2RpcmVjdGl2ZUluc3RhbmNlLmNhbGxNZXRob2QoJ25nQWZ0ZXJDb250ZW50SW5pdCcsIFtdKS50b1N0bXQoKV0pKTtcbiAgfVxuICBpZiAobGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5BZnRlckNvbnRlbnRDaGVja2VkKSAhPT0gLTEpIHtcbiAgICBhZnRlckNvbnRlbnRMaWZlY3ljbGVDYWxsYmFja3NNZXRob2QuYWRkU3RtdChcbiAgICAgICAgZGlyZWN0aXZlSW5zdGFuY2UuY2FsbE1ldGhvZCgnbmdBZnRlckNvbnRlbnRDaGVja2VkJywgW10pLnRvU3RtdCgpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZERpcmVjdGl2ZUFmdGVyVmlld0xpZmVjeWNsZUNhbGxiYWNrcyhkaXJlY3RpdmVNZXRhOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVJbnN0YW5jZTogby5FeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZUVsZW1lbnQ6IENvbXBpbGVFbGVtZW50KSB7XG4gIHZhciB2aWV3ID0gY29tcGlsZUVsZW1lbnQudmlldztcbiAgdmFyIGxpZmVjeWNsZUhvb2tzID0gZGlyZWN0aXZlTWV0YS5saWZlY3ljbGVIb29rcztcbiAgdmFyIGFmdGVyVmlld0xpZmVjeWNsZUNhbGxiYWNrc01ldGhvZCA9IHZpZXcuYWZ0ZXJWaWV3TGlmZWN5Y2xlQ2FsbGJhY2tzTWV0aG9kO1xuICBhZnRlclZpZXdMaWZlY3ljbGVDYWxsYmFja3NNZXRob2QucmVzZXREZWJ1Z0luZm8oY29tcGlsZUVsZW1lbnQubm9kZUluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZUVsZW1lbnQuc291cmNlQXN0KTtcbiAgaWYgKGxpZmVjeWNsZUhvb2tzLmluZGV4T2YoTGlmZWN5Y2xlSG9va3MuQWZ0ZXJWaWV3SW5pdCkgIT09IC0xKSB7XG4gICAgYWZ0ZXJWaWV3TGlmZWN5Y2xlQ2FsbGJhY2tzTWV0aG9kLmFkZFN0bXQobmV3IG8uSWZTdG10KFxuICAgICAgICBTVEFURV9JU19ORVZFUl9DSEVDS0VELCBbZGlyZWN0aXZlSW5zdGFuY2UuY2FsbE1ldGhvZCgnbmdBZnRlclZpZXdJbml0JywgW10pLnRvU3RtdCgpXSkpO1xuICB9XG4gIGlmIChsaWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLkFmdGVyVmlld0NoZWNrZWQpICE9PSAtMSkge1xuICAgIGFmdGVyVmlld0xpZmVjeWNsZUNhbGxiYWNrc01ldGhvZC5hZGRTdG10KFxuICAgICAgICBkaXJlY3RpdmVJbnN0YW5jZS5jYWxsTWV0aG9kKCduZ0FmdGVyVmlld0NoZWNrZWQnLCBbXSkudG9TdG10KCkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kRGlyZWN0aXZlRGVzdHJveUxpZmVjeWNsZUNhbGxiYWNrcyhkaXJlY3RpdmVNZXRhOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlSW5zdGFuY2U6IG8uRXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlRWxlbWVudDogQ29tcGlsZUVsZW1lbnQpIHtcbiAgdmFyIG9uRGVzdHJveU1ldGhvZCA9IGNvbXBpbGVFbGVtZW50LnZpZXcuZGVzdHJveU1ldGhvZDtcbiAgb25EZXN0cm95TWV0aG9kLnJlc2V0RGVidWdJbmZvKGNvbXBpbGVFbGVtZW50Lm5vZGVJbmRleCwgY29tcGlsZUVsZW1lbnQuc291cmNlQXN0KTtcbiAgaWYgKGRpcmVjdGl2ZU1ldGEubGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5PbkRlc3Ryb3kpICE9PSAtMSkge1xuICAgIG9uRGVzdHJveU1ldGhvZC5hZGRTdG10KGRpcmVjdGl2ZUluc3RhbmNlLmNhbGxNZXRob2QoJ25nT25EZXN0cm95JywgW10pLnRvU3RtdCgpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZFBpcGVEZXN0cm95TGlmZWN5Y2xlQ2FsbGJhY2tzKFxuICAgIHBpcGVNZXRhOiBDb21waWxlUGlwZU1ldGFkYXRhLCBkaXJlY3RpdmVJbnN0YW5jZTogby5FeHByZXNzaW9uLCB2aWV3OiBDb21waWxlVmlldykge1xuICB2YXIgb25EZXN0cm95TWV0aG9kID0gdmlldy5kZXN0cm95TWV0aG9kO1xuICBpZiAocGlwZU1ldGEubGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5PbkRlc3Ryb3kpICE9PSAtMSkge1xuICAgIG9uRGVzdHJveU1ldGhvZC5hZGRTdG10KGRpcmVjdGl2ZUluc3RhbmNlLmNhbGxNZXRob2QoJ25nT25EZXN0cm95JywgW10pLnRvU3RtdCgpKTtcbiAgfVxufVxuIl19