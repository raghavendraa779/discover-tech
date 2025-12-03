#!/bin/bash
echo "Initializing automation"
git add .
git commit -m "$1"
git push
echo "Deployment Completed. BILLA"

