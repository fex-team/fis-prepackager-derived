module.exports = function(ret, conf, settings, opt) {
    var files = [];

    fis.util.map(ret.src, function(subpath, file){

        if (!file.extras || !file.extras.derived) {
            return;
        }

        files.push(file);

        file.extras.derived.forEach(function(obj) {
            obj.__proto__ = file.__proto__;
            ret.pkg[obj.subpath] = obj;

            files.push(obj);
        });
    });

    // 转换 {{prop:subpath}} 变量。
    files.forEach(function(file) {
        var content = file.getContent();

        content  = content.replace(/\{\{(\w+)\:(.+?)\}\}/g, function(_, prop, subpath) {
            var target = ret.src[subpath] || ret.pkg[subpath];

            if (!target) {
                return _;
            }

            var val = '';

            switch (prop) {
                case 'url':
                    val = target.getUrl(opt.hash, opt.domain);
                    break;

                default:
                    val = target[prop];
                    return
            }

            return val;
        });

        file.setContent(content);
    });
};