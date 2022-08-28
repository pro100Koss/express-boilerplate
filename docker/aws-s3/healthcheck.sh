STATUSCODE=$(curl --silent --output /dev/stderr --write-out "%{http_code}" http://localhost:8000)

if test $STATUSCODE -ne 403; then
  exit 1
else
  exit 0
fi
