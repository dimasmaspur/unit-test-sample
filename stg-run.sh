#!/bin/bash
set -euo pipefail

MAILTO=""
NODEVERSION='v12.16.1'
PATH="/home/ubuntu/bin:/home/ubuntu/.local/bin:/home/ubuntu/.nvm/versions/node/$NODEVERSION/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

with_timestamps() {
    while read -r line; do
        echo -e "$(date '+%D %T')\t$line"
    done
}

main() {
    cd $DIR && \
	aws s3 cp s3://eplant-artifact/staging/app-server/latest/eplant-server.zip . && \
	unzip -o eplant-server.zip && \
	rm eplant-server.zip && \
	mkdir -p config && \
	aws s3 cp s3://eplant-configuration/staging/app-server/config/.env . && \
	npm install --loglevel=error && \
	npm run staging-start
}

mkdir -p $DIR/logs && main | with_timestamps >> $DIR/logs/run-$(date +%y%m%d%H%M%S).log
