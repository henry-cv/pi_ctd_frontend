#!/bin/bash

# Script para seleccionar la URL del backend según la rama
if [ "$VERCEL_GIT_COMMIT_REF" = "main" ]; then
  echo "Using production backend"
  export BACKEND_URL="http://54.157.227.84:8080"
elif [ "$VERCEL_GIT_COMMIT_REF" = "dev" ]; then
  echo "Using development backend"
  export BACKEND_URL="http://44.195.185.220:8080"
elif [ "$VERCEL_GIT_COMMIT_REF" = "test" ]; then
  echo "Using test backend"
  export BACKEND_URL="http://34.192.152.81:8080"
else
  echo "Unknown branch, using development backend"
  export BACKEND_URL="http://44.195.185.220:8080"
fi

# Mostrar la configuración para debug
echo "Branch: $VERCEL_GIT_COMMIT_REF"
echo "Backend URL: $BACKEND_URL"