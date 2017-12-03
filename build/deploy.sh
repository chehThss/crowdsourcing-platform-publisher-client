#!/usr/bin/env sh

current_dir=$(dirname "$0")
targets="szp15.cn:/srv/http/crowdsourcing/public/admin"

pushd "$current_dir"
for target in $targets; do
  rsync --delete -avh "../dist/" $target
done
popd
