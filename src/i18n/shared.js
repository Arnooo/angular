'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parse_util_1 = require('angular2/src/compiler/parse_util');
var html_ast_1 = require('angular2/src/compiler/html_ast');
var lang_1 = require('angular2/src/facade/lang');
var message_1 = require('./message');
exports.I18N_ATTR = "i18n";
exports.I18N_ATTR_PREFIX = "i18n-";
/**
 * An i18n error.
 */
var I18nError = (function (_super) {
    __extends(I18nError, _super);
    function I18nError(span, msg) {
        _super.call(this, span, msg);
    }
    return I18nError;
}(parse_util_1.ParseError));
exports.I18nError = I18nError;
// Man, this is so ugly!
function partition(nodes, errors) {
    var res = [];
    for (var i = 0; i < nodes.length; ++i) {
        var n = nodes[i];
        var temp = [];
        if (_isOpeningComment(n)) {
            var i18n = n.value.substring(5).trim();
            i++;
            while (!_isClosingComment(nodes[i])) {
                temp.push(nodes[i++]);
                if (i === nodes.length) {
                    errors.push(new I18nError(n.sourceSpan, "Missing closing 'i18n' comment."));
                    break;
                }
            }
            res.push(new Part(null, null, temp, i18n, true));
        }
        else if (n instanceof html_ast_1.HtmlElementAst) {
            var i18n = _findI18nAttr(n);
            res.push(new Part(n, null, n.children, lang_1.isPresent(i18n) ? i18n.value : null, lang_1.isPresent(i18n)));
        }
        else if (n instanceof html_ast_1.HtmlTextAst) {
            res.push(new Part(null, n, null, null, false));
        }
    }
    return res;
}
exports.partition = partition;
var Part = (function () {
    function Part(rootElement, rootTextNode, children, i18n, hasI18n) {
        this.rootElement = rootElement;
        this.rootTextNode = rootTextNode;
        this.children = children;
        this.i18n = i18n;
        this.hasI18n = hasI18n;
    }
    Object.defineProperty(Part.prototype, "sourceSpan", {
        get: function () {
            if (lang_1.isPresent(this.rootElement))
                return this.rootElement.sourceSpan;
            else if (lang_1.isPresent(this.rootTextNode))
                return this.rootTextNode.sourceSpan;
            else
                return this.children[0].sourceSpan;
        },
        enumerable: true,
        configurable: true
    });
    Part.prototype.createMessage = function (parser) {
        return new message_1.Message(stringifyNodes(this.children, parser), meaning(this.i18n), description(this.i18n));
    };
    return Part;
}());
exports.Part = Part;
function _isOpeningComment(n) {
    return n instanceof html_ast_1.HtmlCommentAst && lang_1.isPresent(n.value) && n.value.startsWith("i18n:");
}
function _isClosingComment(n) {
    return n instanceof html_ast_1.HtmlCommentAst && lang_1.isPresent(n.value) && n.value == "/i18n";
}
function _findI18nAttr(p) {
    var i18n = p.attrs.filter(function (a) { return a.name == exports.I18N_ATTR; });
    return i18n.length == 0 ? null : i18n[0];
}
function meaning(i18n) {
    if (lang_1.isBlank(i18n) || i18n == "")
        return null;
    return i18n.split("|")[0];
}
exports.meaning = meaning;
function description(i18n) {
    if (lang_1.isBlank(i18n) || i18n == "")
        return null;
    var parts = i18n.split("|");
    return parts.length > 1 ? parts[1] : null;
}
exports.description = description;
function messageFromAttribute(parser, p, attr) {
    var expectedName = attr.name.substring(5);
    var matching = p.attrs.filter(function (a) { return a.name == expectedName; });
    if (matching.length > 0) {
        var value = removeInterpolation(matching[0].value, matching[0].sourceSpan, parser);
        return new message_1.Message(value, meaning(attr.value), description(attr.value));
    }
    else {
        throw new I18nError(p.sourceSpan, "Missing attribute '" + expectedName + "'.");
    }
}
exports.messageFromAttribute = messageFromAttribute;
function removeInterpolation(value, source, parser) {
    try {
        var parsed = parser.splitInterpolation(value, source.toString());
        if (lang_1.isPresent(parsed)) {
            var res = "";
            for (var i = 0; i < parsed.strings.length; ++i) {
                res += parsed.strings[i];
                if (i != parsed.strings.length - 1) {
                    res += "<ph name=\"" + i + "\"/>";
                }
            }
            return res;
        }
        else {
            return value;
        }
    }
    catch (e) {
        return value;
    }
}
exports.removeInterpolation = removeInterpolation;
function stringifyNodes(nodes, parser) {
    var visitor = new _StringifyVisitor(parser);
    return html_ast_1.htmlVisitAll(visitor, nodes).join("");
}
exports.stringifyNodes = stringifyNodes;
var _StringifyVisitor = (function () {
    function _StringifyVisitor(_parser) {
        this._parser = _parser;
        this._index = 0;
    }
    _StringifyVisitor.prototype.visitElement = function (ast, context) {
        var name = this._index++;
        var children = this._join(html_ast_1.htmlVisitAll(this, ast.children), "");
        return "<ph name=\"e" + name + "\">" + children + "</ph>";
    };
    _StringifyVisitor.prototype.visitAttr = function (ast, context) { return null; };
    _StringifyVisitor.prototype.visitText = function (ast, context) {
        var index = this._index++;
        var noInterpolation = removeInterpolation(ast.value, ast.sourceSpan, this._parser);
        if (noInterpolation != ast.value) {
            return "<ph name=\"t" + index + "\">" + noInterpolation + "</ph>";
        }
        else {
            return ast.value;
        }
    };
    _StringifyVisitor.prototype.visitComment = function (ast, context) { return ""; };
    _StringifyVisitor.prototype._join = function (strs, str) {
        return strs.filter(function (s) { return s.length > 0; }).join(str);
    };
    return _StringifyVisitor;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1XR3dnT3NJYy50bXAvYW5ndWxhcjIvc3JjL2kxOG4vc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJCQUEwQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQzdFLHlCQVFPLGdDQUFnQyxDQUFDLENBQUE7QUFDeEMscUJBQWlDLDBCQUEwQixDQUFDLENBQUE7QUFDNUQsd0JBQXNCLFdBQVcsQ0FBQyxDQUFBO0FBR3JCLGlCQUFTLEdBQUcsTUFBTSxDQUFDO0FBQ25CLHdCQUFnQixHQUFHLE9BQU8sQ0FBQztBQUV4Qzs7R0FFRztBQUNIO0lBQStCLDZCQUFVO0lBQ3ZDLG1CQUFZLElBQXFCLEVBQUUsR0FBVztRQUFJLGtCQUFNLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUFDLENBQUM7SUFDdkUsZ0JBQUM7QUFBRCxDQUFDLEFBRkQsQ0FBK0IsdUJBQVUsR0FFeEM7QUFGWSxpQkFBUyxZQUVyQixDQUFBO0FBR0Qsd0JBQXdCO0FBQ3hCLG1CQUEwQixLQUFnQixFQUFFLE1BQW9CO0lBQzlELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUViLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBSSxJQUFJLEdBQW9CLENBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pELENB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bnQiOlsiaW1wb3J0IHtQYXJzZVNvdXJjZVNwYW4sIFBhcnNlRXJyb3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9wYXJzZV91dGlsJztcbmltcG9ydCB7XG4gIEh0bWxBc3QsXG4gIEh0bWxBc3RWaXNpdG9yLFxuICBIdG1sRWxlbWVudEFzdCxcbiAgSHRtbEF0dHJBc3QsXG4gIEh0bWxUZXh0QXN0LFxuICBIdG1sQ29tbWVudEFzdCxcbiAgaHRtbFZpc2l0QWxsXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9odG1sX2FzdCc7XG5pbXBvcnQge2lzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi9tZXNzYWdlJztcbmltcG9ydCB7UGFyc2VyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvZXhwcmVzc2lvbl9wYXJzZXIvcGFyc2VyJztcblxuZXhwb3J0IGNvbnN0IEkxOE5fQVRUUiA9IFwiaTE4blwiO1xuZXhwb3J0IGNvbnN0IEkxOE5fQVRUUl9QUkVGSVggPSBcImkxOG4tXCI7XG5cbi8qKlxuICogQW4gaTE4biBlcnJvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEkxOG5FcnJvciBleHRlbmRzIFBhcnNlRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihzcGFuOiBQYXJzZVNvdXJjZVNwYW4sIG1zZzogc3RyaW5nKSB7IHN1cGVyKHNwYW4sIG1zZyk7IH1cbn1cblxuXG4vLyBNYW4sIHRoaXMgaXMgc28gdWdseSFcbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aXRpb24obm9kZXM6IEh0bWxBc3RbXSwgZXJyb3JzOiBQYXJzZUVycm9yW10pOiBQYXJ0W10ge1xuICBsZXQgcmVzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgIGxldCBuID0gbm9kZXNbaV07XG4gICAgbGV0IHRlbXAgPSBbXTtcbiAgICBpZiAoX2lzT3BlbmluZ0NvbW1lbnQobikpIHtcbiAgICAgIGxldCBpMThuID0gKDxIdG1sQ29tbWVudEFzdD5uKS52YWx1ZS5zdWJzdHJpbmcoNSkudHJpbSgpO1xuICAgICAgaSsrO1xuICAgICAgd2hpbGUgKCFfaXNDbG9zaW5nQ29tbWVudChub2Rlc1tpXSkpIHtcbiAgICAgICAgdGVtcC5wdXNoKG5vZGVzW2krK10pO1xuICAgICAgICBpZiAoaSA9PT0gbm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgZXJyb3JzLnB1c2gobmV3IEkxOG5FcnJvcihuLnNvdXJjZVNwYW4sIFwiTWlzc2luZyBjbG9zaW5nICdpMThuJyBjb21tZW50LlwiKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlcy5wdXNoKG5ldyBQYXJ0KG51bGwsIG51bGwsIHRlbXAsIGkxOG4sIHRydWUpKTtcblxuICAgIH0gZWxzZSBpZiAobiBpbnN0YW5jZW9mIEh0bWxFbGVtZW50QXN0KSB7XG4gICAgICBsZXQgaTE4biA9IF9maW5kSTE4bkF0dHIobik7XG4gICAgICByZXMucHVzaChuZXcgUGFydChuLCBudWxsLCBuLmNoaWxkcmVuLCBpc1ByZXNlbnQoaTE4bikgPyBpMThuLnZhbHVlIDogbnVsbCwgaXNQcmVzZW50KGkxOG4pKSk7XG4gICAgfSBlbHNlIGlmIChuIGluc3RhbmNlb2YgSHRtbFRleHRBc3QpIHtcbiAgICAgIHJlcy5wdXNoKG5ldyBQYXJ0KG51bGwsIG4sIG51bGwsIG51bGwsIGZhbHNlKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGNsYXNzIFBhcnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcm9vdEVsZW1lbnQ6IEh0bWxFbGVtZW50QXN0LCBwdWJsaWMgcm9vdFRleHROb2RlOiBIdG1sVGV4dEFzdCxcbiAgICAgICAgICAgICAgcHVibGljIGNoaWxkcmVuOiBIdG1sQXN0W10sIHB1YmxpYyBpMThuOiBzdHJpbmcsIHB1YmxpYyBoYXNJMThuOiBib29sZWFuKSB7fVxuXG4gIGdldCBzb3VyY2VTcGFuKCk6IFBhcnNlU291cmNlU3BhbiB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnJvb3RFbGVtZW50KSlcbiAgICAgIHJldHVybiB0aGlzLnJvb3RFbGVtZW50LnNvdXJjZVNwYW47XG4gICAgZWxzZSBpZiAoaXNQcmVzZW50KHRoaXMucm9vdFRleHROb2RlKSlcbiAgICAgIHJldHVybiB0aGlzLnJvb3RUZXh0Tm9kZS5zb3VyY2VTcGFuO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuWzBdLnNvdXJjZVNwYW47XG4gIH1cblxuICBjcmVhdGVNZXNzYWdlKHBhcnNlcjogUGFyc2VyKTogTWVzc2FnZSB7XG4gICAgcmV0dXJuIG5ldyBNZXNzYWdlKHN0cmluZ2lmeU5vZGVzKHRoaXMuY2hpbGRyZW4sIHBhcnNlciksIG1lYW5pbmcodGhpcy5pMThuKSxcbiAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24odGhpcy5pMThuKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2lzT3BlbmluZ0NvbW1lbnQobjogSHRtbEFzdCk6IGJvb2xlYW4ge1xuICByZXR1cm4gbiBpbnN0YW5jZW9mIEh0bWxDb21tZW50QXN0ICYmIGlzUHJlc2VudChuLnZhbHVlKSAmJiBuLnZhbHVlLnN0YXJ0c1dpdGgoXCJpMThuOlwiKTtcbn1cblxuZnVuY3Rpb24gX2lzQ2xvc2luZ0NvbW1lbnQobjogSHRtbEFzdCk6IGJvb2xlYW4ge1xuICByZXR1cm4gbiBpbnN0YW5jZW9mIEh0bWxDb21tZW50QXN0ICYmIGlzUHJlc2VudChuLnZhbHVlKSAmJiBuLnZhbHVlID09IFwiL2kxOG5cIjtcbn1cblxuZnVuY3Rpb24gX2ZpbmRJMThuQXR0cihwOiBIdG1sRWxlbWVudEFzdCk6IEh0bWxBdHRyQXN0IHtcbiAgbGV0IGkxOG4gPSBwLmF0dHJzLmZpbHRlcihhID0+IGEubmFtZSA9PSBJMThOX0FUVFIpO1xuICByZXR1cm4gaTE4bi5sZW5ndGggPT0gMCA/IG51bGwgOiBpMThuWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVhbmluZyhpMThuOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoaXNCbGFuayhpMThuKSB8fCBpMThuID09IFwiXCIpIHJldHVybiBudWxsO1xuICByZXR1cm4gaTE4bi5zcGxpdChcInxcIilbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXNjcmlwdGlvbihpMThuOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoaXNCbGFuayhpMThuKSB8fCBpMThuID09IFwiXCIpIHJldHVybiBudWxsO1xuICBsZXQgcGFydHMgPSBpMThuLnNwbGl0KFwifFwiKTtcbiAgcmV0dXJuIHBhcnRzLmxlbmd0aCA+IDEgPyBwYXJ0c1sxXSA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlRnJvbUF0dHJpYnV0ZShwYXJzZXI6IFBhcnNlciwgcDogSHRtbEVsZW1lbnRBc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cjogSHRtbEF0dHJBc3QpOiBNZXNzYWdlIHtcbiAgbGV0IGV4cGVjdGVkTmFtZSA9IGF0dHIubmFtZS5zdWJzdHJpbmcoNSk7XG4gIGxldCBtYXRjaGluZyA9IHAuYXR0cnMuZmlsdGVyKGEgPT4gYS5uYW1lID09IGV4cGVjdGVkTmFtZSk7XG5cbiAgaWYgKG1hdGNoaW5nLmxlbmd0aCA+IDApIHtcbiAgICBsZXQgdmFsdWUgPSByZW1vdmVJbnRlcnBvbGF0aW9uKG1hdGNoaW5nWzBdLnZhbHVlLCBtYXRjaGluZ1swXS5zb3VyY2VTcGFuLCBwYXJzZXIpO1xuICAgIHJldHVybiBuZXcgTWVzc2FnZSh2YWx1ZSwgbWVhbmluZyhhdHRyLnZhbHVlKSwgZGVzY3JpcHRpb24oYXR0ci52YWx1ZSkpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBJMThuRXJyb3IocC5zb3VyY2VTcGFuLCBgTWlzc2luZyBhdHRyaWJ1dGUgJyR7ZXhwZWN0ZWROYW1lfScuYCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUludGVycG9sYXRpb24odmFsdWU6IHN0cmluZywgc291cmNlOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXI6IFBhcnNlcik6IHN0cmluZyB7XG4gIHRyeSB7XG4gICAgbGV0IHBhcnNlZCA9IHBhcnNlci5zcGxpdEludGVycG9sYXRpb24odmFsdWUsIHNvdXJjZS50b1N0cmluZygpKTtcbiAgICBpZiAoaXNQcmVzZW50KHBhcnNlZCkpIHtcbiAgICAgIGxldCByZXMgPSBcIlwiO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJzZWQuc3RyaW5ncy5sZW5ndGg7ICsraSkge1xuICAgICAgICByZXMgKz0gcGFyc2VkLnN0cmluZ3NbaV07XG4gICAgICAgIGlmIChpICE9IHBhcnNlZC5zdHJpbmdzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICByZXMgKz0gYDxwaCBuYW1lPVwiJHtpfVwiLz5gO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnlOb2Rlcyhub2RlczogSHRtbEFzdFtdLCBwYXJzZXI6IFBhcnNlcik6IHN0cmluZyB7XG4gIGxldCB2aXNpdG9yID0gbmV3IF9TdHJpbmdpZnlWaXNpdG9yKHBhcnNlcik7XG4gIHJldHVybiBodG1sVmlzaXRBbGwodmlzaXRvciwgbm9kZXMpLmpvaW4oXCJcIik7XG59XG5cbmNsYXNzIF9TdHJpbmdpZnlWaXNpdG9yIGltcGxlbWVudHMgSHRtbEFzdFZpc2l0b3Ige1xuICBwcml2YXRlIF9pbmRleDogbnVtYmVyID0gMDtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcGFyc2VyOiBQYXJzZXIpIHt9XG5cbiAgdmlzaXRFbGVtZW50KGFzdDogSHRtbEVsZW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgbGV0IG5hbWUgPSB0aGlzLl9pbmRleCsrO1xuICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuX2pvaW4oaHRtbFZpc2l0QWxsKHRoaXMsIGFzdC5jaGlsZHJlbiksIFwiXCIpO1xuICAgIHJldHVybiBgPHBoIG5hbWU9XCJlJHtuYW1lfVwiPiR7Y2hpbGRyZW59PC9waD5gO1xuICB9XG5cbiAgdmlzaXRBdHRyKGFzdDogSHRtbEF0dHJBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmlzaXRUZXh0KGFzdDogSHRtbFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5faW5kZXgrKztcbiAgICBsZXQgbm9JbnRlcnBvbGF0aW9uID0gcmVtb3ZlSW50ZXJwb2xhdGlvbihhc3QudmFsdWUsIGFzdC5zb3VyY2VTcGFuLCB0aGlzLl9wYXJzZXIpO1xuICAgIGlmIChub0ludGVycG9sYXRpb24gIT0gYXN0LnZhbHVlKSB7XG4gICAgICByZXR1cm4gYDxwaCBuYW1lPVwidCR7aW5kZXh9XCI+JHtub0ludGVycG9sYXRpb259PC9waD5gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYXN0LnZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0Q29tbWVudChhc3Q6IEh0bWxDb21tZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gXCJcIjsgfVxuXG4gIHByaXZhdGUgX2pvaW4oc3Ryczogc3RyaW5nW10sIHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3Rycy5maWx0ZXIocyA9PiBzLmxlbmd0aCA+IDApLmpvaW4oc3RyKTtcbiAgfVxufVxuIl19