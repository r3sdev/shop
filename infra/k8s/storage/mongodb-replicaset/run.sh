#!/bin/sh

helm install shop-mongodb-replicaset stable/mongodb-replicaset --namespace development -f values.yaml