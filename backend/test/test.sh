# #!/bin/bash

# Test files to run
util_tests=(
  "testRecognize.js" 
  "testCycle.js" 
  "testAuth.js"
  "testCache.js" 
  "testDb.js" 
  "testEmail.js"
)

model_tests=(
  "testExpenseModel.js"
  "testBudgetModel.js"
  "testUserModel.js"
)

# Run Tests on Util Modules
total=${#util_tests[@]}
passed=0

echo -e "\n----- UTIL TESTS -----"
for file in "${util_tests[@]}"; do
  node ./test/testJs/$file

  if [[ $? -eq 0 ]]; then
    ((passed++))
  fi
done

echo -e "\n$passed/$total util tests passed"

# Run Tests on Model Modules
total=${#model_tests[@]}
passed=0

echo -e "\n----- MODEL TESTS -----"
for file in "${model_tests[@]}"; do
  node ./test/testJs/$file

  if [[ $? -eq 0 ]]; then
    ((passed++))
  fi
done

echo -e "\n$passed/$total model tests passed"