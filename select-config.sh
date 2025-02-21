#!/bin/bash

# Determinar la URL del backend según la rama
if [ "$VERCEL_GIT_COMMIT_REF" = "main" ]; then
  echo "Using production backend"
  BACKEND_URL="http://54.157.227.84:8080"
elif [ "$VERCEL_GIT_COMMIT_REF" = "dev" ]; then
  echo "Using development backend"
  BACKEND_URL="http://44.195.185.220:8080"
elif [ "$VERCEL_GIT_COMMIT_REF" = "test" ]; then
  echo "Using test backend"
  BACKEND_URL="http://34.192.152.81:8080"
else
  echo "Unknown branch, using development backend"
  BACKEND_URL="http://44.195.185.220:8080"
fi

# Mostrar la configuración para debug
echo "Branch: $VERCEL_GIT_COMMIT_REF"
echo "Backend URL: $BACKEND_URL"

# Generar vercel.json con la URL hardcodeada
cat > vercel.json << EOL
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "${BACKEND_URL}/:path*"
    }
  ]
}
EOL

echo "vercel.json generado con éxito:"
cat vercel.json