#!/bin/sh

helm install shop-mongodb-replicaset stable/mongodb-replicaset --namespace $NAMESPACE -f values.yaml