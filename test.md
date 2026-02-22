# Day 21  Shell Scripting Cheat Sheet: My Personal Reference Guide

## Quick Syntax Snapshot.....

## Bash Quick Reference

| Topic      | Core Syntax                          | Small Example                          |
|------------|--------------------------------------|----------------------------------------|
| Variable   | `VAR="value"`                        | `PROJECT="DevOps"`                    |
| Argument   | `$1, $2`                             | `./test.sh input1`                    |
| If         | `if [ condition ]; then`             | `if [ -f demo.txt ]; then`            |
| For loop   | `for item in list; do`               | `for i in 1 2 3; do`                  |
| Until      | `until [ condition ]; do`            | `until [ $i -eq 5 ]; do`              |
| Function   | `func() { ... }`                     | `say_hi() { echo "Hi"; }`             |
| Grep       | `grep pattern file`                  | `grep -i "fail" app.log`              |
| Awk        | `awk '{print $1}' file`              | `awk -F: '{print $1}' /etc/passwd`    |
| Sed        | `sed 's/old/new/g' file`             | `sed -i 's/dev/prod/g' config`        |
| Case       | `case var in ... esac`               | `case $opt in 1)... ;; esac`          |
| Sort       | `sort file`                          | `sort -n data.txt`                    |
| Tr         | `tr set1 set2`                       | `tr a-z A-Z < file`                   |
| Wc         | `wc -l file`                         | `wc -w notes.txt`                     |
| Head       | `head -n 5 file`                     | `head -10 app.log`                    |
| Tail       | `tail -n 5 file`                     | `tail -20 app.log`                    |


## Task 1: Core Basics
## 1. Shebang (#!/bin/bash)

This line always stays at the top of the script.
It clearly tells the system to execute the script using the Bash interpreter.

If not mentioned, the system may use the default shell (/bin/sh).

### 2. How to Execute a Script
```
chmod +x script.sh  #gives execution permission

./script.sh # runs script using defined interpreter

bash script.sh # runs script explicitly using bash
```
### 3. Comments
```
Single line comment is |  # This is comment

Inline comment is |  echo "Hello" # comment here
```
### 4. Variables
```
user="Ishaq"      # declaration
echo "$user"      # accessing value
echo '$user'      # prints literally: $user
```
Double quotes expand variables, single quotes do not.

### 5. Taking Input
```
read -p "Enter your name: " username
```
This stores user input into username.

### 6. Command-Line Arguments
```
$0  #Script name

$1 #First argument

$# #Number of arguments

$@ #All arguments

$? #Exit status of previous command
```
## Task 2: Operators & Conditions

### 1. String Comparison

Operators used: =, !=, -z, -n
```
= #check equality

!= #check inequality

-z #true if string is empty

-n #true if string is not empty
```
**Example idea:**
```
if [[ $a = $b ]]; then
   echo "Equal"
fi
```
### 2. Integer Comparison

Operators:
```
-eq #equal

-ne #not equal

-lt #less than

-gt #greater than

-le #less or equal

-ge #greater or equal
```
**Example:**
```
if [ $a -gt $b ]; then
   echo "Greater"
fi
```
### 3. File Test Operators
```
-f #regular file exists

-d #directory exists

-e #file/directory exists

-r #readable

-w #writable

-x #executable

-s #not empty
```
These are helpful in validation scripts.

### 4. If–Elif–Else Structure
```
if [ condition ]; then
   echo "True"
elif [ condition ]; then
   echo "Another case"
else
   echo "False"
fi
```
### 5. Logical Operators
```
&&  AND

||  OR

!  NOT
```
Example:
```
(( a > b )) && echo "Yes" || echo "No"
```
### 6. Case Statement

Useful when checking multiple values.
```
case $choice in
   1) echo "Option 1";;
   2) echo "Option 2";;
   *) echo "Invalid";;
esac
```
## Task 3: Loops
### 1. For Loop

List-based:
```
for item in Apple Mango Orange; do
   echo "$item"
done
```
C-style:
```
for (( i=0; i<5; i++ )); do
   echo $i
done
```
### 2. While Loop

Runs while condition is true.
```
while [ $i -gt 0 ]; do
   echo $i
   ((i--))
done
```
### 3. Until Loop

Runs until condition becomes true.
```
until [ $i -eq 5 ]; do
   echo $i
   ((i++))
done
```
### 4. Break & Continue
```
break #exits loop

continue #skips current iteration
```
### 5. Loop Through Files
```
for file in *.sh; do
   echo "$file"
done
```
### 6. Read Command Output
```
cat file.txt | while read line; do
   echo "$line"
done
```
## Task 4: Functions
Defining & Calling
```
sum() {
   local a=$1
   local b=$2
   echo "Result: $((a+b))"
}

Call function:

sum 3 5
```
**Key Points**

- local keeps variable limited to function

- return sends exit code

- echo prints output

## Task 5: Text Processing
**grep**

Common options:

- -i ignore case

- -r recursive

- -c count

- -n line numbers

- -v invert match

- -E extended regex

**awk**

- Print columns | awk '{print $1}' file

- Custom separator | -F:

- BEGIN / END blocks

**sed**

- Replace text | sed 's/old/new/g' file

- Delete lines | sed '2,4d' file

- In-place edit | sed -i

**cut**

Extract columns:
```
cut -d: -f1 /etc/passwd
```
**sort**

Numeric  -n

Reverse  -r

Unique  -u

**uniq**
```
sort file.txt | uniq -c
```
**tr**

- Convert lowercase to uppercase

- Delete characters

**wc**

- Counts lines, words, characters.

- head / tail

- Show first or last lines of a file.

### Task 6: Handy One-Liners

- Find old files | ```find . -mtime +7```

- Count lines | ```wc -l *.log```

Replace string in multiple files | ```sed 's/test/prod/g' *.txt```

Check service | ```systemctl status ssh```

Disk usage alert | ```df -h | awk '$5>80'```

Monitor log live | ```tail -f app.log | grep error```

## Task 7: Error Handling & Debugging

**Exit Codes**

```$?```  previous command status

```exit 0``` success

```exit 1``` failure

**Safety Options**

```set -e```  stop on error

```set -u```  error on undefined variable

```set -o pipefail``` fail if any command in pipe fails

```set -x ``` debug mode

**Trap**
```
trap 'echo "Cleaning up..."' EXIT
```
The command trap 'echo "CleanUp"' EXIT tells the script to print "CleanUp" whenever it exits.

You can also create a function like cleanup() and place any commands inside it—for example, rm /archive/*.gz. When the script finishes (no matter how it exits), the cleanup function will automatically run.
