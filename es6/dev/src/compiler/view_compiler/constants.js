import { isBlank, resolveEnumToken } from 'angular2/src/facade/lang';
import { CompileIdentifierMetadata } from '../compile_metadata';
import { ChangeDetectorState, ChangeDetectionStrategy } from 'angular2/src/core/change_detection/change_detection';
import { ViewEncapsulation } from 'angular2/src/core/metadata/view';
import { ViewType } from 'angular2/src/core/linker/view_type';
import * as o from '../output/output_ast';
import { Identifiers } from '../identifiers';
function _enumExpression(classIdentifier, value) {
    if (isBlank(value))
        return o.NULL_EXPR;
    var name = resolveEnumToken(classIdentifier.runtime, value);
    return o.importExpr(new CompileIdentifierMetadata({
        name: `${classIdentifier.name}.${name}`,
        moduleUrl: classIdentifier.moduleUrl,
        runtime: value
    }));
}
export class ViewTypeEnum {
    static fromValue(value) {
        return _enumExpression(Identifiers.ViewType, value);
    }
}
ViewTypeEnum.HOST = ViewTypeEnum.fromValue(ViewType.HOST);
ViewTypeEnum.COMPONENT = ViewTypeEnum.fromValue(ViewType.COMPONENT);
ViewTypeEnum.EMBEDDED = ViewTypeEnum.fromValue(ViewType.EMBEDDED);
export class ViewEncapsulationEnum {
    static fromValue(value) {
        return _enumExpression(Identifiers.ViewEncapsulation, value);
    }
}
ViewEncapsulationEnum.Emulated = ViewEncapsulationEnum.fromValue(ViewEncapsulation.Emulated);
ViewEncapsulationEnum.Native = ViewEncapsulationEnum.fromValue(ViewEncapsulation.Native);
ViewEncapsulationEnum.None = ViewEncapsulationEnum.fromValue(ViewEncapsulation.None);
export class ChangeDetectorStateEnum {
    static fromValue(value) {
        return _enumExpression(Identifiers.ChangeDetectorState, value);
    }
}
ChangeDetectorStateEnum.NeverChecked = ChangeDetectorStateEnum.fromValue(ChangeDetectorState.NeverChecked);
ChangeDetectorStateEnum.CheckedBefore = ChangeDetectorStateEnum.fromValue(ChangeDetectorState.CheckedBefore);
ChangeDetectorStateEnum.Errored = ChangeDetectorStateEnum.fromValue(ChangeDetectorState.Errored);
export class ChangeDetectionStrategyEnum {
    static fromValue(value) {
        return _enumExpression(Identifiers.ChangeDetectionStrategy, value);
    }
}
ChangeDetectionStrategyEnum.CheckOnce = ChangeDetectionStrategyEnum.fromValue(ChangeDetectionStrategy.CheckOnce);
ChangeDetectionStrategyEnum.Checked = ChangeDetectionStrategyEnum.fromValue(ChangeDetectionStrategy.Checked);
ChangeDetectionStrategyEnum.CheckAlways = ChangeDetectionStrategyEnum.fromValue(ChangeDetectionStrategy.CheckAlways);
ChangeDetectionStrategyEnum.Detached = ChangeDetectionStrategyEnum.fromValue(ChangeDetectionStrategy.Detached);
ChangeDetectionStrategyEnum.OnPush = ChangeDetectionStrategyEnum.fromValue(ChangeDetectionStrategy.OnPush);
ChangeDetectionStrategyEnum.Default = ChangeDetectionStrategyEnum.fromValue(ChangeDetectionStrategy.Default);
export class ViewConstructorVars {
}
ViewConstructorVars.viewManager = o.variable('viewManager');
ViewConstructorVars.parentInjector = o.variable('parentInjector');
ViewConstructorVars.declarationEl = o.variable('declarationEl');
export class ViewProperties {
}
ViewProperties.renderer = o.THIS_EXPR.prop('renderer');
ViewProperties.projectableNodes = o.THIS_EXPR.prop('projectableNodes');
ViewProperties.viewManager = o.THIS_EXPR.prop('viewManager');
export class EventHandlerVars {
}
EventHandlerVars.event = o.variable('$event');
export class InjectMethodVars {
}
InjectMethodVars.token = o.variable('token');
InjectMethodVars.requestNodeIndex = o.variable('requestNodeIndex');
InjectMethodVars.notFoundResult = o.variable('notFoundResult');
export class DetectChangesVars {
}
DetectChangesVars.throwOnChange = o.variable(`throwOnChange`);
DetectChangesVars.changes = o.variable(`changes`);
DetectChangesVars.changed = o.variable(`changed`);
DetectChangesVars.valUnwrapper = o.variable(`valUnwrapper`);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1leVpKb1Z0RS50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIvY29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQWdCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLDBCQUEwQjtPQUMxRSxFQUFDLHlCQUF5QixFQUF1QixNQUFNLHFCQUFxQjtPQUM1RSxFQUNMLG1CQUFtQixFQUNuQix1QkFBdUIsRUFDeEIsTUFBTSxxREFBcUQ7T0FDckQsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlDQUFpQztPQUMxRCxFQUFDLFFBQVEsRUFBQyxNQUFNLG9DQUFvQztPQUNwRCxLQUFLLENBQUMsTUFBTSxzQkFBc0I7T0FDbEMsRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0I7QUFFMUMseUJBQXlCLGVBQTBDLEVBQUUsS0FBVTtJQUM3RSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUN2QyxJQUFJLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUkseUJBQXlCLENBQUM7UUFDaEQsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7UUFDdkMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTO1FBQ3BDLE9BQU8sRUFBRSxLQUFLO0tBQ2YsQ0FBQyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQ7SUFDRSxPQUFPLFNBQVMsQ0FBQyxLQUFlO1FBQzlCLE1BQU0sQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJ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QUFDO0FBSFEsc0JBQUssR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVCLGlDQUFnQixHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNsRCwrQkFBYyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FDckQ7QUFFRDtBQUtBLENBQUM7QUFKUSwrQkFBYSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDNUMseUJBQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hDLHlCQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoQyw4QkFBWSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQ2pEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtzZXJpYWxpemVFbnVtLCBpc0JsYW5rLCByZXNvbHZlRW51bVRva2VufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtDb21waWxlSWRlbnRpZmllck1ldGFkYXRhLCBDb21waWxlVG9rZW5NZXRhZGF0YX0gZnJvbSAnLi4vY29tcGlsZV9tZXRhZGF0YSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclN0YXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NoYW5nZV9kZXRlY3Rpb24nO1xuaW1wb3J0IHtWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvdmlldyc7XG5pbXBvcnQge1ZpZXdUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld190eXBlJztcbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtJZGVudGlmaWVyc30gZnJvbSAnLi4vaWRlbnRpZmllcnMnO1xuXG5mdW5jdGlvbiBfZW51bUV4cHJlc3Npb24oY2xhc3NJZGVudGlmaWVyOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhLCB2YWx1ZTogYW55KTogby5FeHByZXNzaW9uIHtcbiAgaWYgKGlzQmxhbmsodmFsdWUpKSByZXR1cm4gby5OVUxMX0VYUFI7XG4gIHZhciBuYW1lID0gcmVzb2x2ZUVudW1Ub2tlbihjbGFzc0lkZW50aWZpZXIucnVudGltZSwgdmFsdWUpO1xuICByZXR1cm4gby5pbXBvcnRFeHByKG5ldyBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhKHtcbiAgICBuYW1lOiBgJHtjbGFzc0lkZW50aWZpZXIubmFtZX0uJHtuYW1lfWAsXG4gICAgbW9kdWxlVXJsOiBjbGFzc0lkZW50aWZpZXIubW9kdWxlVXJsLFxuICAgIHJ1bnRpbWU6IHZhbHVlXG4gIH0pKTtcbn1cblxuZXhwb3J0IGNsYXNzIFZpZXdUeXBlRW51bSB7XG4gIHN0YXRpYyBmcm9tVmFsdWUodmFsdWU6IFZpZXdUeXBlKTogby5FeHByZXNzaW9uIHtcbiAgICByZXR1cm4gX2VudW1FeHByZXNzaW9uKElkZW50aWZpZXJzLlZpZXdUeXBlLCB2YWx1ZSk7XG4gIH1cbiAgc3RhdGljIEhPU1QgPSBWaWV3VHlwZUVudW0uZnJvbVZhbHVlKFZpZXdUeXBlLkhPU1QpO1xuICBzdGF0aWMgQ09NUE9ORU5UID0gVmlld1R5cGVFbnVtLmZyb21WYWx1ZShWaWV3VHlwZS5DT01QT05FTlQpO1xuICBzdGF0aWMgRU1CRURERUQgPSBWaWV3VHlwZUVudW0uZnJvbVZhbHVlKFZpZXdUeXBlLkVNQkVEREVEKTtcbn1cblxuZXhwb3J0IGNsYXNzIFZpZXdFbmNhcHN1bGF0aW9uRW51bSB7XG4gIHN0YXRpYyBmcm9tVmFsdWUodmFsdWU6IFZpZXdFbmNhcHN1bGF0aW9uKTogby5FeHByZXNzaW9uIHtcbiAgICByZXR1cm4gX2VudW1FeHByZXNzaW9uKElkZW50aWZpZXJzLlZpZXdFbmNhcHN1bGF0aW9uLCB2YWx1ZSk7XG4gIH1cbiAgc3RhdGljIEVtdWxhdGVkID0gVmlld0VuY2Fwc3VsYXRpb25FbnVtLmZyb21WYWx1ZShWaWV3RW5jYXBzdWxhdGlvbi5FbXVsYXRlZCk7XG4gIHN0YXRpYyBOYXRpdmUgPSBWaWV3RW5jYXBzdWxhdGlvbkVudW0uZnJvbVZhbHVlKFZpZXdFbmNhcHN1bGF0aW9uLk5hdGl2ZSk7XG4gIHN0YXRpYyBOb25lID0gVmlld0VuY2Fwc3VsYXRpb25FbnVtLmZyb21WYWx1ZShWaWV3RW5jYXBzdWxhdGlvbi5Ob25lKTtcbn1cblxuZXhwb3J0IGNsYXNzIENoYW5nZURldGVjdG9yU3RhdGVFbnVtIHtcbiAgc3RhdGljIGZyb21WYWx1ZSh2YWx1ZTogQ2hhbmdlRGV0ZWN0b3JTdGF0ZSk6IG8uRXhwcmVzc2lvbiB7XG4gICAgcmV0dXJuIF9lbnVtRXhwcmVzc2lvbihJZGVudGlmaWVycy5DaGFuZ2VEZXRlY3RvclN0YXRlLCB2YWx1ZSk7XG4gIH1cbiAgc3RhdGljIE5ldmVyQ2hlY2tlZCA9IENoYW5nZURldGVjdG9yU3RhdGVFbnVtLmZyb21WYWx1ZShDaGFuZ2VEZXRlY3RvclN0YXRlLk5ldmVyQ2hlY2tlZCk7XG4gIHN0YXRpYyBDaGVja2VkQmVmb3JlID0gQ2hhbmdlRGV0ZWN0b3JTdGF0ZUVudW0uZnJvbVZhbHVlKENoYW5nZURldGVjdG9yU3RhdGUuQ2hlY2tlZEJlZm9yZSk7XG4gIHN0YXRpYyBFcnJvcmVkID0gQ2hhbmdlRGV0ZWN0b3JTdGF0ZUVudW0uZnJvbVZhbHVlKENoYW5nZURldGVjdG9yU3RhdGUuRXJyb3JlZCk7XG59XG5cbmV4cG9ydCBjbGFzcyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneUVudW0ge1xuICBzdGF0aWMgZnJvbVZhbHVlKHZhbHVlOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSk6IG8uRXhwcmVzc2lvbiB7XG4gICAgcmV0dXJuIF9lbnVtRXhwcmVzc2lvbihJZGVudGlmaWVycy5DaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgdmFsdWUpO1xuICB9XG4gIHN0YXRpYyBDaGVja09uY2UgPSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneUVudW0uZnJvbVZhbHVlKENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkNoZWNrT25jZSk7XG4gIHN0YXRpYyBDaGVja2VkID0gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lFbnVtLmZyb21WYWx1ZShDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5DaGVja2VkKTtcbiAgc3RhdGljIENoZWNrQWx3YXlzID0gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lFbnVtLmZyb21WYWx1ZShDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5DaGVja0Fsd2F5cyk7XG4gIHN0YXRpYyBEZXRhY2hlZCA9IENoYW5nZURldGVjdGlvblN0cmF0ZWd5RW51bS5mcm9tVmFsdWUoQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGV0YWNoZWQpO1xuICBzdGF0aWMgT25QdXNoID0gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lFbnVtLmZyb21WYWx1ZShDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gpO1xuICBzdGF0aWMgRGVmYXVsdCA9IENoYW5nZURldGVjdGlvblN0cmF0ZWd5RW51bS5mcm9tVmFsdWUoQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCk7XG59XG5cbmV4cG9ydCBjbGFzcyBWaWV3Q29uc3RydWN0b3JWYXJzIHtcbiAgc3RhdGljIHZpZXdNYW5hZ2VyID0gby52YXJpYWJsZSgndmlld01hbmFnZXInKTtcbiAgc3RhdGljIHBhcmVudEluamVjdG9yID0gby52YXJpYWJsZSgncGFyZW50SW5qZWN0b3InKTtcbiAgc3RhdGljIGRlY2xhcmF0aW9uRWwgPSBvLnZhcmlhYmxlKCdkZWNsYXJhdGlvbkVsJyk7XG59XG5cbmV4cG9ydCBjbGFzcyBWaWV3UHJvcGVydGllcyB7XG4gIHN0YXRpYyByZW5kZXJlciA9IG8uVEhJU19FWFBSLnByb3AoJ3JlbmRlcmVyJyk7XG4gIHN0YXRpYyBwcm9qZWN0YWJsZU5vZGVzID0gby5USElTX0VYUFIucHJvcCgncHJvamVjdGFibGVOb2RlcycpO1xuICBzdGF0aWMgdmlld01hbmFnZXIgPSBvLlRISVNfRVhQUi5wcm9wKCd2aWV3TWFuYWdlcicpO1xufVxuXG5leHBvcnQgY2xhc3MgRXZlbnRIYW5kbGVyVmFycyB7IHN0YXRpYyBldmVudCA9IG8udmFyaWFibGUoJyRldmVudCcpOyB9XG5cbmV4cG9ydCBjbGFzcyBJbmplY3RNZXRob2RWYXJzIHtcbiAgc3RhdGljIHRva2VuID0gby52YXJpYWJsZSgndG9rZW4nKTtcbiAgc3RhdGljIHJlcXVlc3ROb2RlSW5kZXggPSBvLnZhcmlhYmxlKCdyZXF1ZXN0Tm9kZUluZGV4Jyk7XG4gIHN0YXRpYyBub3RGb3VuZFJlc3VsdCA9IG8udmFyaWFibGUoJ25vdEZvdW5kUmVzdWx0Jyk7XG59XG5cbmV4cG9ydCBjbGFzcyBEZXRlY3RDaGFuZ2VzVmFycyB7XG4gIHN0YXRpYyB0aHJvd09uQ2hhbmdlID0gby52YXJpYWJsZShgdGhyb3dPbkNoYW5nZWApO1xuICBzdGF0aWMgY2hhbmdlcyA9IG8udmFyaWFibGUoYGNoYW5nZXNgKTtcbiAgc3RhdGljIGNoYW5nZWQgPSBvLnZhcmlhYmxlKGBjaGFuZ2VkYCk7XG4gIHN0YXRpYyB2YWxVbndyYXBwZXIgPSBvLnZhcmlhYmxlKGB2YWxVbndyYXBwZXJgKTtcbn1cbiJdfQ==