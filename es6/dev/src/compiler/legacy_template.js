var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/src/core/di';
import { StringWrapper, RegExpWrapper, CONST_EXPR, isPresent } from 'angular2/src/facade/lang';
import { HtmlAttrAst, HtmlElementAst } from './html_ast';
import { HtmlParser, HtmlParseTreeResult } from './html_parser';
import { dashCaseToCamelCase } from './util';
var LONG_SYNTAX_REGEXP = /^(?:on-(.*)|bindon-(.*)|bind-(.*)|var-(.*))$/ig;
var SHORT_SYNTAX_REGEXP = /^(?:\((.*)\)|\[\((.*)\)\]|\[(.*)\]|#(.*))$/ig;
var VARIABLE_TPL_BINDING_REGEXP = /(\bvar\s+|#)(\S+)/ig;
var TEMPLATE_SELECTOR_REGEXP = /^(\S+)/g;
var SPECIAL_PREFIXES_REGEXP = /^(class|style|attr)\./ig;
var INTERPOLATION_REGEXP = /\{\{.*?\}\}/g;
const SPECIAL_CASES = CONST_EXPR([
    'ng-non-bindable',
    'ng-default-control',
    'ng-no-form',
]);
/**
 * Convert templates to the case sensitive syntax
 *
 * @internal
 */
export class LegacyHtmlAstTransformer {
    constructor(dashCaseSelectors) {
        this.dashCaseSelectors = dashCaseSelectors;
        this.rewrittenAst = [];
        this.visitingTemplateEl = false;
    }
    visitComment(ast, context) { return ast; }
    visitElement(ast, context) {
        this.visitingTemplateEl = ast.name.toLowerCase() == 'template';
        let attrs = ast.attrs.map(attr => attr.visit(this, null));
        let children = ast.children.map(child => child.visit(this, null));
        return new HtmlElementAst(ast.name, attrs, children, ast.sourceSpan, ast.startSourceSpan, ast.endSourceSpan);
    }
    visitAttr(originalAst, context) {
        let ast = originalAst;
        if (this.visitingTemplateEl) {
            if (isPresent(RegExpWrapper.firstMatch(LONG_SYNTAX_REGEXP, ast.name))) {
                // preserve the "-" in the prefix for the long syntax
                ast = this._rewriteLongSyntax(ast);
            }
            else {
                // rewrite any other attribute
                let name = dashCaseToCamelCase(ast.name);
                ast = name == ast.name ? ast : new HtmlAttrAst(name, ast.value, ast.sourceSpan);
            }
        }
        else {
            ast = this._rewriteTemplateAttribute(ast);
            ast = this._rewriteLongSyntax(ast);
            ast = this._rewriteShortSyntax(ast);
            ast = this._rewriteStar(ast);
            ast = this._rewriteInterpolation(ast);
            ast = this._rewriteSpecialCases(ast);
        }
        if (ast !== originalAst) {
            this.rewrittenAst.push(ast);
        }
        return ast;
    }
    visitText(ast, context) { return ast; }
    _rewriteLongSyntax(ast) {
        let m = RegExpWrapper.firstMatch(LONG_SYNTAX_REGEXP, ast.name);
        let attrName = ast.name;
        let attrValue = ast.value;
        if (isPresent(m)) {
            if (isPresent(m[1])) {
                attrName = `on-${dashCaseToCamelCase(m[1])}`;
            }
            else if (isPresent(m[2])) {
                attrName = `bindon-${dashCaseToCamelCase(m[2])}`;
            }
            else if (isPresent(m[3])) {
                attrName = `bind-${dashCaseToCamelCase(m[3])}`;
            }
            else if (isPresent(m[4])) {
                attrName = `var-${dashCaseToCamelCase(m[4])}`;
                attrValue = dashCaseToCamelCase(attrValue);
            }
        }
        return attrName == ast.name && attrValue == ast.value ?
            ast :
            new HtmlAttrAst(attrName, attrValue, ast.sourceSpan);
    }
    _rewriteTemplateAttribute(ast) {
        let name = ast.name;
        let value = ast.value;
        if (name.toLowerCase() == 'template') {
            name = 'template';
            // rewrite the directive selector
            value = StringWrapper.replaceAllMapped(value, TEMPLATE_SELECTOR_REGEXP, (m) => { return dashCaseToCamelCase(m[1]); });
            // rewrite the var declarations
            value = StringWrapper.replaceAllMapped(value, VARIABLE_TPL_BINDING_REGEXP, m => {
                return `${m[1].toLowerCase()}${dashCaseToCamelCase(m[2])}`;
            });
        }
        if (name == ast.name && value == ast.value) {
            return ast;
        }
        return new HtmlAttrAst(name, value, ast.sourceSpan);
    }
    _rewriteShortSyntax(ast) {
        let m = RegExpWrapper.firstMatch(SHORT_SYNTAX_REGEXP, ast.name);
        let attrName = ast.name;
        let attrValue = ast.value;
        if (isPresent(m)) {
            if (isPresent(m[1])) {
                attrName = `(${dashCaseToCamelCase(m[1])})`;
            }
            else if (isPresent(m[2])) {
                attrName = `[(${dashCaseToCamelCase(m[2])})]`;
            }
            else if (isPresent(m[3])) {
                let prop = StringWrapper.replaceAllMapped(m[3], SPECIAL_PREFIXES_REGEXP, (m) => { return m[1].toLowerCase() + '.'; });
                if (prop.startsWith('class.') || prop.startsWith('attr.') || prop.startsWith('style.')) {
                    attrName = `[${prop}]`;
                }
                else {
                    attrName = `[${dashCaseToCamelCase(prop)}]`;
                }
            }
            else if (isPresent(m[4])) {
                attrName = `#${dashCaseToCamelCase(m[4])}`;
                attrValue = dashCaseToCamelCase(attrValue);
            }
        }
        return attrName == ast.name && attrValue == ast.value ?
            ast :
            new HtmlAttrAst(attrName, attrValue, ast.sourceSpan);
    }
    _rewriteStar(ast) {
        let attrName = ast.name;
        let attrValue = ast.value;
        if (attrName[0] == '*') {
            attrName = dashCaseToCamelCase(attrName);
            // rewrite the var declarations
            attrValue = StringWrapper.replaceAllMapped(attrValue, VARIABLE_TPL_BINDING_REGEXP, m => {
                return `${m[1].toLowerCase()}${dashCaseToCamelCase(m[2])}`;
            });
        }
        return attrName == ast.name && attrValue == ast.value ?
            ast :
            new HtmlAttrAst(attrName, attrValue, ast.sourceSpan);
    }
    _rewriteInterpolation(ast) {
        let hasInterpolation = RegExpWrapper.test(INTERPOLATION_REGEXP, ast.value);
        if (!hasInterpolation) {
            return ast;
        }
        let name = ast.name;
        if (!(name.startsWith('attr.') || name.startsWith('class.') || name.startsWith('style.'))) {
            name = dashCaseToCamelCase(ast.name);
        }
        return name == ast.name ? ast : new HtmlAttrAst(name, ast.value, ast.sourceSpan);
    }
    _rewriteSpecialCases(ast) {
        let attrName = ast.name;
        if (SPECIAL_CASES.indexOf(attrName) > -1) {
            return new HtmlAttrAst(dashCaseToCamelCase(attrName), ast.value, ast.sourceSpan);
        }
        if (isPresent(this.dashCaseSelectors) && this.dashCaseSelectors.indexOf(attrName) > -1) {
            return new HtmlAttrAst(dashCaseToCamelCase(attrName), ast.value, ast.sourceSpan);
        }
        return ast;
    }
}
export let LegacyHtmlParser = class LegacyHtmlParser extends HtmlParser {
    parse(sourceContent, sourceUrl) {
        let transformer = new LegacyHtmlAstTransformer();
        let htmlParseTreeResult = super.parse(sourceContent, sourceUrl);
        let rootNodes = htmlParseTreeResult.rootNodes.map(node => node.visit(transformer, null));
        return transformer.rewrittenAst.length > 0 ?
            new HtmlParseTreeResult(rootNodes, htmlParseTreeResult.errors) :
            htmlParseTreeResult;
    }
};
LegacyHtmlParser = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], LegacyHtmlParser);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnYWN5X3RlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1leVpKb1Z0RS50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL2xlZ2FjeV90ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLFVBQVUsRUFBb0IsTUFBTSxzQkFBc0I7T0FFM0QsRUFDTCxhQUFhLEVBQ2IsYUFBYSxFQUNiLFVBQVUsRUFFVixTQUFTLEVBQ1YsTUFBTSwwQkFBMEI7T0FFMUIsRUFFTCxXQUFXLEVBQ1gsY0FBYyxFQUlmLE1BQU0sWUFBWTtPQUNaLEVBQUMsVUFBVSxFQUFFLG1CQUFtQixFQUFDLE1BQU0sZUFBZTtPQUV0RCxFQUFDLG1CQUFtQixFQUFzQixNQUFNLFFBQVE7QUFFL0QsSUFBSSxrQkFBa0IsR0FBRyxnREFBZ0QsQ0FBQztBQUMxRSxJQUFJLG1CQUFtQixHQUFHLDhDQUE4QyxDQUFDO0FBQ3pFLElBQUksMkJBQTJCLEdBQUcscUJBQXFCLENBQUM7QUFDeEQsSUFBSSx3QkFBd0IsR0FBRyxTQUFTLENBQUM7QUFDekMsSUFBSSx1QkFBdUIsR0FBRyx5QkFBeUIsQ0FBQztBQUN4RCxJQUFJLG9CQUFvQixHQUFHLGNBQWMsQ0FBQztBQUUxQyxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUM7SUFDL0IsaUJBQWlCO0lBQ2pCLG9CQUFvQjtJQUNwQixZQUFZO0NBQ2IsQ0FBQyxDQUFDO0FBRUg7Ozs7R0FJRztBQUNIO0lBSUUsWUFBb0IsaUJBQTRCO1FBQTVCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBVztRQUhoRCxpQkFBWSxHQUFjLEVBQUUsQ0FBQztRQUM3Qix1QkFBa0IsR0FBWSxLQUFLLENBQUM7SUFFZSxDQUFDO0lBRXBELFlBQVksQ0FBQyxHQUFtQixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUVwRSxZ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QUMsQ0FBQztRQUNuRixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZGLE1BQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuRixDQUFDO1FBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7QUFDSCxDQUFDO0FBR0QsNkRBQXNDLFVBQVU7SUFDOUMsS0FBSyxDQUFDLGFBQXFCLEVBQUUsU0FBaUI7UUFDNUMsSUFBSSxXQUFXLEdBQUcsSUFBSSx3QkFBd0IsRUFBRSxDQUFDO1FBQ2pELElBQUksbUJBQW1CLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFaEUsSUFBSSxTQUFTLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUV6RixNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUMvQixJQUFJLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7WUFDOUQsbUJBQW1CLENBQUM7SUFDakMsQ0FBQztBQUNILENBQUM7QUFaRDtJQUFDLFVBQVUsRUFBRTs7b0JBQUE7QUFZWiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZSwgUHJvdmlkZXIsIHByb3ZpZGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcblxuaW1wb3J0IHtcbiAgU3RyaW5nV3JhcHBlcixcbiAgUmVnRXhwV3JhcHBlcixcbiAgQ09OU1RfRVhQUixcbiAgaXNCbGFuayxcbiAgaXNQcmVzZW50XG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmltcG9ydCB7XG4gIEh0bWxBc3RWaXNpdG9yLFxuICBIdG1sQXR0ckFzdCxcbiAgSHRtbEVsZW1lbnRBc3QsXG4gIEh0bWxUZXh0QXN0LFxuICBIdG1sQ29tbWVudEFzdCxcbiAgSHRtbEFzdFxufSBmcm9tICcuL2h0bWxfYXN0JztcbmltcG9ydCB7SHRtbFBhcnNlciwgSHRtbFBhcnNlVHJlZVJlc3VsdH0gZnJvbSAnLi9odG1sX3BhcnNlcic7XG5cbmltcG9ydCB7ZGFzaENhc2VUb0NhbWVsQ2FzZSwgY2FtZWxDYXNlVG9EYXNoQ2FzZX0gZnJvbSAnLi91dGlsJztcblxudmFyIExPTkdfU1lOVEFYX1JFR0VYUCA9IC9eKD86b24tKC4qKXxiaW5kb24tKC4qKXxiaW5kLSguKil8dmFyLSguKikpJC9pZztcbnZhciBTSE9SVF9TWU5UQVhfUkVHRVhQID0gL14oPzpcXCgoLiopXFwpfFxcW1xcKCguKilcXClcXF18XFxbKC4qKVxcXXwjKC4qKSkkL2lnO1xudmFyIFZBUklBQkxFX1RQTF9CSU5ESU5HX1JFR0VYUCA9IC8oXFxidmFyXFxzK3wjKShcXFMrKS9pZztcbnZhciBURU1QTEFURV9TRUxFQ1RPUl9SRUdFWFAgPSAvXihcXFMrKS9nO1xudmFyIFNQRUNJQUxfUFJFRklYRVNfUkVHRVhQID0gL14oY2xhc3N8c3R5bGV8YXR0cilcXC4vaWc7XG52YXIgSU5URVJQT0xBVElPTl9SRUdFWFAgPSAvXFx7XFx7Lio/XFx9XFx9L2c7XG5cbmNvbnN0IFNQRUNJQUxfQ0FTRVMgPSBDT05TVF9FWFBSKFtcbiAgJ25nLW5vbi1iaW5kYWJsZScsXG4gICduZy1kZWZhdWx0LWNvbnRyb2wnLFxuICAnbmctbm8tZm9ybScsXG5dKTtcblxuLyoqXG4gKiBDb252ZXJ0IHRlbXBsYXRlcyB0byB0aGUgY2FzZSBzZW5zaXRpdmUgc3ludGF4XG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjbGFzcyBMZWdhY3lIdG1sQXN0VHJhbnNmb3JtZXIgaW1wbGVtZW50cyBIdG1sQXN0VmlzaXRvciB7XG4gIHJld3JpdHRlbkFzdDogSHRtbEFzdFtdID0gW107XG4gIHZpc2l0aW5nVGVtcGxhdGVFbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGFzaENhc2VTZWxlY3RvcnM/OiBzdHJpbmdbXSkge31cblxuICB2aXNpdENvbW1lbnQoYXN0OiBIdG1sQ29tbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIGFzdDsgfVxuXG4gIHZpc2l0RWxlbWVudChhc3Q6IEh0bWxFbGVtZW50QXN0LCBjb250ZXh0OiBhbnkpOiBIdG1sRWxlbWVudEFzdCB7XG4gICAgdGhpcy52aXNpdGluZ1RlbXBsYXRlRWwgPSBhc3QubmFtZS50b0xvd2VyQ2FzZSgpID09ICd0ZW1wbGF0ZSc7XG4gICAgbGV0IGF0dHJzID0gYXN0LmF0dHJzLm1hcChhdHRyID0+IGF0dHIudmlzaXQodGhpcywgbnVsbCkpO1xuICAgIGxldCBjaGlsZHJlbiA9IGFzdC5jaGlsZHJlbi5tYXAoY2hpbGQgPT4gY2hpbGQudmlzaXQodGhpcywgbnVsbCkpO1xuICAgIHJldHVybiBuZXcgSHRtbEVsZW1lbnRBc3QoYXN0Lm5hbWUsIGF0dHJzLCBjaGlsZHJlbiwgYXN0LnNvdXJjZVNwYW4sIGFzdC5zdGFydFNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3QuZW5kU291cmNlU3Bhbik7XG4gIH1cblxuICB2aXNpdEF0dHIob3JpZ2luYWxBc3Q6IEh0bWxBdHRyQXN0LCBjb250ZXh0OiBhbnkpOiBIdG1sQXR0ckFzdCB7XG4gICAgbGV0IGFzdCA9IG9yaWdpbmFsQXN0O1xuXG4gICAgaWYgKHRoaXMudmlzaXRpbmdUZW1wbGF0ZUVsKSB7XG4gICAgICBpZiAoaXNQcmVzZW50KFJlZ0V4cFdyYXBwZXIuZmlyc3RNYXRjaChMT05HX1NZTlRBWF9SRUdFWFAsIGFzdC5uYW1lKSkpIHtcbiAgICAgICAgLy8gcHJlc2VydmUgdGhlIFwiLVwiIGluIHRoZSBwcmVmaXggZm9yIHRoZSBsb25nIHN5bnRheFxuICAgICAgICBhc3QgPSB0aGlzLl9yZXdyaXRlTG9uZ1N5bnRheChhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmV3cml0ZSBhbnkgb3RoZXIgYXR0cmlidXRlXG4gICAgICAgIGxldCBuYW1lID0gZGFzaENhc2VUb0NhbWVsQ2FzZShhc3QubmFtZSk7XG4gICAgICAgIGFzdCA9IG5hbWUgPT0gYXN0Lm5hbWUgPyBhc3QgOiBuZXcgSHRtbEF0dHJBc3QobmFtZSwgYXN0LnZhbHVlLCBhc3Quc291cmNlU3Bhbik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzdCA9IHRoaXMuX3Jld3JpdGVUZW1wbGF0ZUF0dHJpYnV0ZShhc3QpO1xuICAgICAgYXN0ID0gdGhpcy5fcmV3cml0ZUxvbmdTeW50YXgoYXN0KTtcbiAgICAgIGFzdCA9IHRoaXMuX3Jld3JpdGVTaG9ydFN5bnRheChhc3QpO1xuICAgICAgYXN0ID0gdGhpcy5fcmV3cml0ZVN0YXIoYXN0KTtcbiAgICAgIGFzdCA9IHRoaXMuX3Jld3JpdGVJbnRlcnBvbGF0aW9uKGFzdCk7XG4gICAgICBhc3QgPSB0aGlzLl9yZXdyaXRlU3BlY2lhbENhc2VzKGFzdCk7XG4gICAgfVxuXG4gICAgaWYgKGFzdCAhPT0gb3JpZ2luYWxBc3QpIHtcbiAgICAgIHRoaXMucmV3cml0dGVuQXN0LnB1c2goYXN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXN0O1xuICB9XG5cbiAgdmlzaXRUZXh0KGFzdDogSHRtbFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IEh0bWxUZXh0QXN0IHsgcmV0dXJuIGFzdDsgfVxuXG4gIHByaXZhdGUgX3Jld3JpdGVMb25nU3ludGF4KGFzdDogSHRtbEF0dHJBc3QpOiBIdG1sQXR0ckFzdCB7XG4gICAgbGV0IG0gPSBSZWdFeHBXcmFwcGVyLmZpcnN0TWF0Y2goTE9OR19TWU5UQVhfUkVHRVhQLCBhc3QubmFtZSk7XG4gICAgbGV0IGF0dHJOYW1lID0gYXN0Lm5hbWU7XG4gICAgbGV0IGF0dHJWYWx1ZSA9IGFzdC52YWx1ZTtcblxuICAgIGlmIChpc1ByZXNlbnQobSkpIHtcbiAgICAgIGlmIChpc1ByZXNlbnQobVsxXSkpIHtcbiAgICAgICAgYXR0ck5hbWUgPSBgb24tJHtkYXNoQ2FzZVRvQ2FtZWxDYXNlKG1bMV0pfWA7XG4gICAgICB9IGVsc2UgaWYgKGlzUHJlc2VudChtWzJdKSkge1xuICAgICAgICBhdHRyTmFtZSA9IGBiaW5kb24tJHtkYXNoQ2FzZVRvQ2FtZWxDYXNlKG1bMl0pfWA7XG4gICAgICB9IGVsc2UgaWYgKGlzUHJlc2VudChtWzNdKSkge1xuICAgICAgICBhdHRyTmFtZSA9IGBiaW5kLSR7ZGFzaENhc2VUb0NhbWVsQ2FzZShtWzNdKX1gO1xuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQobVs0XSkpIHtcbiAgICAgICAgYXR0ck5hbWUgPSBgdmFyLSR7ZGFzaENhc2VUb0NhbWVsQ2FzZShtWzRdKX1gO1xuICAgICAgICBhdHRyVmFsdWUgPSBkYXNoQ2FzZVRvQ2FtZWxDYXNlKGF0dHJWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJOYW1lID09IGFzdC5uYW1lICYmIGF0dHJWYWx1ZSA9PSBhc3QudmFsdWUgP1xuICAgICAgICAgICAgICAgYXN0IDpcbiAgICAgICAgICAgICAgIG5ldyBIdG1sQXR0ckFzdChhdHRyTmFtZSwgYXR0clZhbHVlLCBhc3Quc291cmNlU3Bhbik7XG4gIH1cblxuICBwcml2YXRlIF9yZXdyaXRlVGVtcGxhdGVBdHRyaWJ1dGUoYXN0OiBIdG1sQXR0ckFzdCk6IEh0bWxBdHRyQXN0IHtcbiAgICBsZXQgbmFtZSA9IGFzdC5uYW1lO1xuICAgIGxldCB2YWx1ZSA9IGFzdC52YWx1ZTtcblxuICAgIGlmIChuYW1lLnRvTG93ZXJDYXNlKCkgPT0gJ3RlbXBsYXRlJykge1xuICAgICAgbmFtZSA9ICd0ZW1wbGF0ZSc7XG5cbiAgICAgIC8vIHJld3JpdGUgdGhlIGRpcmVjdGl2ZSBzZWxlY3RvclxuICAgICAgdmFsdWUgPSBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGxNYXBwZWQodmFsdWUsIFRFTVBMQVRFX1NFTEVDVE9SX1JFR0VYUCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtKSA9PiB7IHJldHVybiBkYXNoQ2FzZVRvQ2FtZWxDYXNlKG1bMV0pOyB9KTtcblxuICAgICAgLy8gcmV3cml0ZSB0aGUgdmFyIGRlY2xhcmF0aW9uc1xuICAgICAgdmFsdWUgPSBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGxNYXBwZWQodmFsdWUsIFZBUklBQkxFX1RQTF9CSU5ESU5HX1JFR0VYUCwgbSA9PiB7XG4gICAgICAgIHJldHVybiBgJHttWzFdLnRvTG93ZXJDYXNlKCl9JHtkYXNoQ2FzZVRvQ2FtZWxDYXNlKG1bMl0pfWA7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PSBhc3QubmFtZSAmJiB2YWx1ZSA9PSBhc3QudmFsdWUpIHtcbiAgICAgIHJldHVybiBhc3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBIdG1sQXR0ckFzdChuYW1lLCB2YWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmV3cml0ZVNob3J0U3ludGF4KGFzdDogSHRtbEF0dHJBc3QpOiBIdG1sQXR0ckFzdCB7XG4gICAgbGV0IG0gPSBSZWdFeHBXcmFwcGVyLmZpcnN0TWF0Y2goU0hPUlRfU1lOVEFYX1JFR0VYUCwgYXN0Lm5hbWUpO1xuICAgIGxldCBhdHRyTmFtZSA9IGFzdC5uYW1lO1xuICAgIGxldCBhdHRyVmFsdWUgPSBhc3QudmFsdWU7XG5cbiAgICBpZiAoaXNQcmVzZW50KG0pKSB7XG4gICAgICBpZiAoaXNQcmVzZW50KG1bMV0pKSB7XG4gICAgICAgIGF0dHJOYW1lID0gYCgke2Rhc2hDYXNlVG9DYW1lbENhc2UobVsxXSl9KWA7XG4gICAgICB9IGVsc2UgaWYgKGlzUHJlc2VudChtWzJdKSkge1xuICAgICAgICBhdHRyTmFtZSA9IGBbKCR7ZGFzaENhc2VUb0NhbWVsQ2FzZShtWzJdKX0pXWA7XG4gICAgICB9IGVsc2UgaWYgKGlzUHJlc2VudChtWzNdKSkge1xuICAgICAgICBsZXQgcHJvcCA9IFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbE1hcHBlZChtWzNdLCBTUEVDSUFMX1BSRUZJWEVTX1JFR0VYUCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG0pID0+IHsgcmV0dXJuIG1bMV0udG9Mb3dlckNhc2UoKSArICcuJzsgfSk7XG5cbiAgICAgICAgaWYgKHByb3Auc3RhcnRzV2l0aCgnY2xhc3MuJykgfHwgcHJvcC5zdGFydHNXaXRoKCdhdHRyLicpIHx8IHByb3Auc3RhcnRzV2l0aCgnc3R5bGUuJykpIHtcbiAgICAgICAgICBhdHRyTmFtZSA9IGBbJHtwcm9wfV1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF0dHJOYW1lID0gYFske2Rhc2hDYXNlVG9DYW1lbENhc2UocHJvcCl9XWA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNQcmVzZW50KG1bNF0pKSB7XG4gICAgICAgIGF0dHJOYW1lID0gYCMke2Rhc2hDYXNlVG9DYW1lbENhc2UobVs0XSl9YDtcbiAgICAgICAgYXR0clZhbHVlID0gZGFzaENhc2VUb0NhbWVsQ2FzZShhdHRyVmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhdHRyTmFtZSA9PSBhc3QubmFtZSAmJiBhdHRyVmFsdWUgPT0gYXN0LnZhbHVlID9cbiAgICAgICAgICAgICAgIGFzdCA6XG4gICAgICAgICAgICAgICBuZXcgSHRtbEF0dHJBc3QoYXR0ck5hbWUsIGF0dHJWYWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmV3cml0ZVN0YXIoYXN0OiBIdG1sQXR0ckFzdCk6IEh0bWxBdHRyQXN0IHtcbiAgICBsZXQgYXR0ck5hbWUgPSBhc3QubmFtZTtcbiAgICBsZXQgYXR0clZhbHVlID0gYXN0LnZhbHVlO1xuXG4gICAgaWYgKGF0dHJOYW1lWzBdID09ICcqJykge1xuICAgICAgYXR0ck5hbWUgPSBkYXNoQ2FzZVRvQ2FtZWxDYXNlKGF0dHJOYW1lKTtcbiAgICAgIC8vIHJld3JpdGUgdGhlIHZhciBkZWNsYXJhdGlvbnNcbiAgICAgIGF0dHJWYWx1ZSA9IFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbE1hcHBlZChhdHRyVmFsdWUsIFZBUklBQkxFX1RQTF9CSU5ESU5HX1JFR0VYUCwgbSA9PiB7XG4gICAgICAgIHJldHVybiBgJHttWzFdLnRvTG93ZXJDYXNlKCl9JHtkYXNoQ2FzZVRvQ2FtZWxDYXNlKG1bMl0pfWA7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXR0ck5hbWUgPT0gYXN0Lm5hbWUgJiYgYXR0clZhbHVlID09IGFzdC52YWx1ZSA/XG4gICAgICAgICAgICAgICBhc3QgOlxuICAgICAgICAgICAgICAgbmV3IEh0bWxBdHRyQXN0KGF0dHJOYW1lLCBhdHRyVmFsdWUsIGFzdC5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Jld3JpdGVJbnRlcnBvbGF0aW9uKGFzdDogSHRtbEF0dHJBc3QpOiBIdG1sQXR0ckFzdCB7XG4gICAgbGV0IGhhc0ludGVycG9sYXRpb24gPSBSZWdFeHBXcmFwcGVyLnRlc3QoSU5URVJQT0xBVElPTl9SRUdFWFAsIGFzdC52YWx1ZSk7XG5cbiAgICBpZiAoIWhhc0ludGVycG9sYXRpb24pIHtcbiAgICAgIHJldHVybiBhc3Q7XG4gICAgfVxuXG4gICAgbGV0IG5hbWUgPSBhc3QubmFtZTtcblxuICAgIGlmICghKG5hbWUuc3RhcnRzV2l0aCgnYXR0ci4nKSB8fCBuYW1lLnN0YXJ0c1dpdGgoJ2NsYXNzLicpIHx8IG5hbWUuc3RhcnRzV2l0aCgnc3R5bGUuJykpKSB7XG4gICAgICBuYW1lID0gZGFzaENhc2VUb0NhbWVsQ2FzZShhc3QubmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5hbWUgPT0gYXN0Lm5hbWUgPyBhc3QgOiBuZXcgSHRtbEF0dHJBc3QobmFtZSwgYXN0LnZhbHVlLCBhc3Quc291cmNlU3Bhbik7XG4gIH1cblxuICBwcml2YXRlIF9yZXdyaXRlU3BlY2lhbENhc2VzKGFzdDogSHRtbEF0dHJBc3QpOiBIdG1sQXR0ckFzdCB7XG4gICAgbGV0IGF0dHJOYW1lID0gYXN0Lm5hbWU7XG5cbiAgICBpZiAoU1BFQ0lBTF9DQVNFUy5pbmRleE9mKGF0dHJOYW1lKSA+IC0xKSB7XG4gICAgICByZXR1cm4gbmV3IEh0bWxBdHRyQXN0KGRhc2hDYXNlVG9DYW1lbENhc2UoYXR0ck5hbWUpLCBhc3QudmFsdWUsIGFzdC5zb3VyY2VTcGFuKTtcbiAgICB9XG5cbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuZGFzaENhc2VTZWxlY3RvcnMpICYmIHRoaXMuZGFzaENhc2VTZWxlY3RvcnMuaW5kZXhPZihhdHRyTmFtZSkgPiAtMSkge1xuICAgICAgcmV0dXJuIG5ldyBIdG1sQXR0ckFzdChkYXNoQ2FzZVRvQ2FtZWxDYXNlKGF0dHJOYW1lKSwgYXN0LnZhbHVlLCBhc3Quc291cmNlU3Bhbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFzdDtcbiAgfVxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTGVnYWN5SHRtbFBhcnNlciBleHRlbmRzIEh0bWxQYXJzZXIge1xuICBwYXJzZShzb3VyY2VDb250ZW50OiBzdHJpbmcsIHNvdXJjZVVybDogc3RyaW5nKTogSHRtbFBhcnNlVHJlZVJlc3VsdCB7XG4gICAgbGV0IHRyYW5zZm9ybWVyID0gbmV3IExlZ2FjeUh0bWxBc3RUcmFuc2Zvcm1lcigpO1xuICAgIGxldCBodG1sUGFyc2VUcmVlUmVzdWx0ID0gc3VwZXIucGFyc2Uoc291cmNlQ29udGVudCwgc291cmNlVXJsKTtcblxuICAgIGxldCByb290Tm9kZXMgPSBodG1sUGFyc2VUcmVlUmVzdWx0LnJvb3ROb2Rlcy5tYXAobm9kZSA9PiBub2RlLnZpc2l0KHRyYW5zZm9ybWVyLCBudWxsKSk7XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtZXIucmV3cml0dGVuQXN0Lmxlbmd0aCA+IDAgP1xuICAgICAgICAgICAgICAgbmV3IEh0bWxQYXJzZVRyZWVSZXN1bHQocm9vdE5vZGVzLCBodG1sUGFyc2VUcmVlUmVzdWx0LmVycm9ycykgOlxuICAgICAgICAgICAgICAgaHRtbFBhcnNlVHJlZVJlc3VsdDtcbiAgfVxufVxuIl19