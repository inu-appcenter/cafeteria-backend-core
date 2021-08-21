#!/usr/bin/env bash

# 한 DB를 다른 DB로 복사합니다.
# 덮어씌워진 DB는 현재 폴더에 백업됩니다.

# Bash 4 이상이 필요해요!

declare -A mysql_args=(
  [local.dev]="--host=localhost --port=3306 --user=potados --password=1234 cafeteria"
  [aws.prod]="--host=${DB_HOST} --port=3306 --user=${DB_USERNAME} --password=${DB_PASSWORD} cafeteria"
)

function usage() {
  echo "사용법:"
  echo "  ./sync-db.sh -f <source> -t <dest> [-d]"
  echo "옵션:"
  echo "  -f  from 원본"
  echo "  -t  to 복사할 위치"
  echo "  -d  dry_run 이 옵션이 주어지면 DB에 아무 영향도 미치지 않고 dump만 합니다."
  exit 1
}

function dump() {
  source=$1
  filename=$2

  echo "${source}를 .${filename}.sql로 dump합니다."

  mysqldump ${mysql_args[${source}]} --no-tablespaces --column-statistics=0 --set-gtid-purged=OFF > ".${filename}.sql"
}

function import() {
  filename=$1
  dest=$2

  echo ".${filename}.sql의 내용을 ${dest}에 덮어씁니다."

  mysql ${mysql_args[${dest}]} < ".${filename}.sql"
}

if [ -z "${DB_HOST}" ] || [ -z "${DB_USERNAME}" ] || [ -z "${DB_PASSWORD}" ]; then
  echo "DB 접속 정보를 환경변수로 설정해 주세요."
  usage
fi

while getopts f:t:d flag; do
  case "${flag}" in
    f) from=$OPTARG;;
    t) to=$OPTARG;;
    d) dry_run=true;;
    *) ;;
  esac
done

if [ -z "${from}" ] || [ -z "${to}" ]; then
  usage
fi

if [ -z "${mysql_args[${from}]}" ] || [ -z "${mysql_args[${to}]}" ]; then
  usage
fi

dump "${to}" "${to}.backup"
dump "${from}" "${from}.export"

if [ -z "${dry_run}" ]; then
  import "${from}.export" "${to}"
fi

