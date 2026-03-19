#include <inttypes.h>

#include "quickjs/quickjs-libc.h"

#include "wrapper.h"

JSRuntime *rt = NULL;
JSContext *ctx = NULL;
JSValue fn = {};

JSValue js_std_eval_file_global(JSContext *ctx, const char *filename) {
    size_t buf_len = 0;
    uint8_t *buf = js_load_file(ctx, &buf_len, filename);
    const JSValue module = JS_Eval(ctx, (const char *) buf, buf_len, filename, JS_EVAL_TYPE_MODULE | JS_EVAL_FLAG_COMPILE_ONLY);
    if (JS_IsException(module)) {
        js_std_dump_error(ctx);
        exit(-1);
    }
    js_module_set_import_meta(ctx, module, 1, 1);
    const JSValue promise = JS_EvalFunction(ctx, module);
    if (JS_IsException(promise)) {
        js_std_dump_error(ctx);
        exit(-1);
    }
    const JSValue res = js_std_await(ctx, promise);
    if (JS_IsException(res)) {
        js_std_dump_error(ctx);
        exit(-1);
    }
    JS_FreeValue(ctx, res);
    js_free(ctx, buf);
    return module;
}

void init_target(const char *file) {
    rt = JS_NewRuntime();
    js_std_set_worker_new_context_func(JS_NewContext);
    js_std_init_handlers(rt);
    ctx = JS_NewContext(rt);
    JS_SetModuleLoaderFunc2(rt, NULL, js_module_loader, js_module_check_attributes, NULL);
    js_std_add_helpers(ctx, -1, NULL);

    const JSValue module = js_std_eval_file_global(ctx, file);
    if (JS_VALUE_GET_TAG(module) != JS_TAG_MODULE) {
        exit(-1);
    }
    JSModuleDef *m = JS_VALUE_GET_PTR(module);
    const JSValue ns = JS_GetModuleNamespace(ctx, m);
    fn = JS_GetPropertyStr(ctx, ns, "processTestcase");
    JS_FreeValue(ctx, ns);
}

void init_target_run() {
    // Nothing to do
}

void target_run(const char *buffer, const size_t buffer_size) {
    if (buffer_size <= 0) {
        mw_exit_error("Buffer size must be non-empty");
    }

    JSValue arg = JS_NewArrayBufferCopy(ctx, (const uint8_t *)buffer, buffer_size);
    const JSValue res = JS_Call(ctx, fn, JS_UNDEFINED, 1, &arg);
    if (JS_IsException(res)) {
        js_std_dump_error(ctx);
        exit(-2);
    }
    JS_FreeValue(ctx, res);
    JS_FreeValue(ctx, arg);
}

void cleanup_target_run() {
    // Nothing to do
}

void init_target_filter(void) {
    PinNotifyFilterAdd(&(FilterEntry){
        .type = FilterTypeMainCall,
        .originStart = 0,
        .originEnd = 0,
        .targetStart = (uintptr_t) &target_run,
        .targetEnd = (uintptr_t) &target_run,
    });
}

void cleanup_target_filter(void) {}

void cleanup_target(void) {
    JS_FreeValue(ctx, fn);
    js_std_free_handlers(rt);
    JS_FreeContext(ctx);
    JS_FreeRuntime(rt);
}
