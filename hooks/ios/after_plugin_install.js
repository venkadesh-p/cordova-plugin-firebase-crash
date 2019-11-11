const fs = require("fs");
const xcode = require("xcode");
const helper = require("./helper");
const path = require("path");

module.exports = function(context) {
    const comment = helper.BUILD_PHASE_COMMENT;
    const xcodeProjectPath = helper.getXcodeProjectPath(context);
    const xcodeProject = xcode.project(xcodeProjectPath);

    const ConfigParser = context.requireCordovaModule("cordova-lib").configparser;
    const appName = new ConfigParser("config.xml").name();

    var proj = new xcode.project(xcodeProjectPath);
    proj.parse(function(err) {
        if (err) {
            console.log("Oh noes! XCODE project failed to parse:");
            console.log(err);
        } else {
            var src = path.resolve('GoogleService-Info.plist')
            var dest = path.resolve("platforms", "ios", appName, "GoogleService-Info.plist")
            fs.copyFileSync(src, dest, (res) => {
            })
            proj.addResourceFile(dest);
            fs.writeFileSync(xcodeProjectPath, proj.writeSync());
        }
    });

    xcodeProject.parseSync();

    // Only add if not already there yet

    const buildPhase = xcodeProject.pbxItemByComment(comment, "PBXShellScriptBuildPhase");

    if (!buildPhase) {
        const result = xcodeProject.addBuildPhase([], "PBXShellScriptBuildPhase", comment, null, {
            shellPath: "/bin/sh",
            shellScript: "\"${PODS_ROOT}/Fabric/run\"",
            inputPaths: ["\"$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)\""]
        });

        result.buildPhase.runOnlyForDeploymentPostprocessing = 1;

        fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync());
    }
};
