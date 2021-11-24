#!/bin/bash
set -euo pipefail

with_timestamps() {
    while read -r line; do
        echo -e "$(date '+%D %T')\t$line"
    done
}

main() {
    IP_LIST=($(aws ec2 describe-instances \
		   --filters 'Name=tag:deployment-tag,Values=eplant-app-dev' \
		   --output text \
		   --query 'Reservations[].Instances[].PublicIpAddress[]'))
    for ip in "${IP_LIST[@]}"
    do
	echo "Deploying to $ip"
	scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "./eplant-server.zip" "ubuntu@$ip:/home/ubuntu/eplant-server/"
	ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$ip 'unzip -o /home/ubuntu/eplant-server/eplant-server.zip -d /home/ubuntu/eplant-server/'
	ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$ip 'rm /home/ubuntu/eplant-server/eplant-server.zip'
	ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$ip '/home/ubuntu/eplant-server/dev-run.sh'
    done
}

main | with_timestamps
