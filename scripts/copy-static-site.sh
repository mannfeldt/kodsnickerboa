#!/bin/sh
set -eu

mkdir -p dist/client/assets/images
mkdir -p dist/client/patchlands/privacy

cp index.html styles.css script.js dist/client/
cp assets/images/*.webp dist/client/assets/images/
cp patchlands/privacy/index.html dist/client/patchlands/privacy/
