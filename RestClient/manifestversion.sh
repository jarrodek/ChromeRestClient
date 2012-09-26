#!/bin/sh

manifestFile="war/extension/manifest.json"

ver=`grep "\"version\":\W\"\([0-9]\)" $manifestFile` #should be something like: "version": "1.0.9",
ver=`grep "\"version\":\W\"\([0-9]\)" $manifestFile | sed 's/"version":\W\?"\([0-9]\{1,\}.[0-9]\{1,\}.[0-9]\{1,\}\)",/\1/g'`
newVer=`echo $ver | awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g'`
rm -f $manifestFile".old"
cp $manifestFile $manifestFile".old"
sed 's/\("version":\W\?"[0-9]\{1,\}.[0-9]\{1,\}.[0-9]\{1,\}",\)/"version": "'$newVer'",/' $manifestFile".old" > $manifestFile
