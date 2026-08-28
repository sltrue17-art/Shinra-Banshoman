#!/bin/sh
# Produce the Artifact-hosted copy of the simulator from index.html:
# the host wraps the file in its own document skeleton, so the page-level
# tags come out and the local three.js fallback (which will not exist there)
# is dropped in favour of the CDN copies.
set -e
DIR=$(dirname "$0")
OUT=${1:-"$DIR/artifact.html"}
python3 - "$DIR/index.html" "$OUT" <<'PY'
import re,sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
for tag in ['<!doctype html>','<html lang="en">','<head>','</head>','<body>','</body>','</html>']:
    s=s.replace(tag+'\n','').replace(tag,'')
s=s.replace('    "vendor/three.min.js",\n','')
s=s.replace('<meta charset="utf-8">\n','')
s=re.sub(r'<meta name="viewport".*?>\n','',s)
open(dst,'w').write(s.strip()+'\n')
print('wrote',dst,len(s),'bytes')
PY
