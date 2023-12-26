@echo off

call npm run docs:build

cd src\.vuepress\dist

git init

git add -A

git commit -m "deploy"

rem git remote add origin git@www.ozh.asia:/home/git/repos/blog.git

rem git push -u origin master

git push -f git@www.ozh.asia:/home/git/repos/blog.git master

pause