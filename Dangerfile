# DangerFile
# https://danger.systems/reference.html
# Tests located in .dangerfile directory

###############################################################################
# Required Libraries
###############################################################################

require 'uri'
require 'yaml'

###############################################################################
# Required External Files
###############################################################################

require_relative '.dangerfile/github_tests'
require_relative '.dangerfile/general_tests'
require_relative '.dangerfile/code_tests'
require_relative '.dangerfile/policy_parser'
require_relative '.dangerfile/policy_tests'

###############################################################################
# File Sorting
###############################################################################

puts Time.now.strftime("%H:%M:%S.%L") + " * Sorting files for testing..."

# Create lists of files based on specific attributes for testing
# Renamed Files.
renamed_files = git.renamed_files.collect{ |r| r[:before] }
# Changed Files. Ignores renamed files to prevent errors on files that don't exist
changed_files = git.added_files + git.modified_files - renamed_files
# Changed Dangerfile
changed_dangerfiles = changed_files.select{ |file| file == "Dangerfile" || file.start_with?(".dangerfile/") }
# Changed Dot Files
changed_dot_files = changed_files.select{ |file| file.start_with?(".") && !file.start_with?(".dangerfile/") }
# Changed Config Files
config_files = ["Gemfile", "Gemfile.lock", "package.json", "package-lock.json"]
changed_config_files = changed_files.select{ |file| config_files.include?(file) }
# Changed Policy Template files. Ignore meta policy files.
changed_pt_files = changed_files.select{ |file| file.end_with?(".pt") && !file.end_with?("broken.pt") }
# Changed Ruby files.
changed_rb_files = changed_files.select{ |file| file.end_with?(".rb") || file == "Dangerfile" || file == "Rakefile" }
# Changed Python files.
changed_py_files = changed_files.select{ |file| file.end_with?(".py") }
# Changed MD files other than the above.
changed_md_files = changed_files.select{ |file| file.end_with?(".md") && !file.start_with?(".github/") }
# Changed JSON files.
changed_json_files = changed_files.select{ |file| file.end_with?(".json") }
# Changed YAML files.
changed_yaml_files = changed_files.select{ |file| file.end_with?(".yaml") || file.end_with?(".yml") }

###############################################################################
# Github Pull Request Testing
###############################################################################

puts Time.now.strftime("%H:%M:%S.%L") + " * Testing Github pull request..."

#test = github_pr_bad_title?(github); warn test if test
test = github_pr_missing_summary?(github); fail test if test
test = github_pr_missing_labels?(github); fail test if test
test = github_pr_missing_ready_label?(github); message test if test

###############################################################################
# Modified Important Files Testing
###############################################################################

puts Time.now.strftime("%H:%M:%S.%L") + " * Testing if important files were modified..."

modified_important_files = changed_dangerfiles + changed_dot_files + changed_config_files
modified_important_files = modified_important_files.join("\n")

# Consolidate changed files into a single warning to save space
warn "### **Important Files Modified**\n\nPlease make sure these modifications were intentional and have been tested. These files are necessary for configuring the Github repository and managing automation.\n\n" + modified_important_files.strip if !modified_important_files.empty?

###############################################################################
# All Files Testing
###############################################################################

puts Time.now.strftime("%H:%M:%S.%L") + " * Testing all changed files..."

changed_files.each do |file|
  puts Time.now.strftime("%H:%M:%S.%L") + " ** Testing " + file + "..."

  warnings = []
  failures = []

  # Perform a basic text lint on all changed files
  # Disabled for now because we have no specific things to test for
  #test = general_textlint?(file); warnings << test if test

  # Output final list of failures and warnings
  fail "### **#{file}**\n\n#{failures.join("\n\n---\n\n")}" if !failures.empty?
  warn "### **#{file}**\n\n#{warnings.join("\n\n---\n\n")}" if !warnings.empty?
end

###############################################################################
# Ruby File Testing
###############################################################################

puts Time.now.strftime("%H:%M:%S.%L") + " * Testing all changed Ruby files..."

# Perform a lint check on changed Ruby files
changed_rb_files.each do |file|
  puts Time.now.strftime("%H:%M:%S.%L") + " ** Testing " + file + "..."

  warnings = []
  failures = []

  # Preread file to avoid reading it multiple times for each method
  file_text = File.read(file)
  file_lines = File.readlines(file)
  file_diff = git.diff_for_file(file)

  # Raise warning if outdated terminology found
  test = general_outdated_terminology?(file, file_lines); warnings << test if test

  # Raise error if code errors found
  test = code_ruby_errors?(file); failures << test if test

  # Rubocop linting currently disabled. It is *very* verbose.
  #test = code_rubocop_problems?(file); warn test if test

  # Output final list of failures and warnings
  fail "### **#{file}**\n\n#{failures.join("\n\n---\n\n")}" if !failures.empty?
  warn "### **#{file}**\n\n#{warnings.join("\n\n---\n\n")}" if !warnings.empty?
end

###############################################################################
# Python File Testing
###############################################################################

puts Time.now.strftime("%H:%M:%S.%L") + " * Testing all changed Python files..."

# Perform a lint check on changed Python files
changed_py_files.each do |file|
  puts Time.now.strftime("%H:%M:%S.%L") + " ** Testing " + file + "..."

  warnings = []
  failures = []

  # Preread file to avoid reading it multiple times for each method
  file_text = File.read(file)
  file_lines = File.readlines(file)
  file_diff = git.diff_for_file(file)

  # Raise warning if outdated terminology found
  test = general_outdated_terminology?(file, file_lines); warnings << test if test

  # Raise error if code errors found
  test = code_python_errors?(file); failures << test if test

  # Output final list of failures and warnings
  fail "### **#{file}**\n\n#{failures.join("\n\n---\n\n")}" if !failures.empty?
  warn "### **#{file}**\n\n#{warnings.join("\n\n---\n\n")}" if !warnings.empty?
end

###############################################################################
# JSON/YAML File Testing
###############################################################################

puts Time.now.strftime("%H:%M:%S.%L") + " * Testing all changed JSON files..."

changed_json_files.each do |file|
  puts Time.now.strftime("%H:%M:%S.%L") + " ** Testing " + file + "..."

  warnings = []
  failures = []

  # Preread file to avoid reading it multiple times for each method
  file_text = File.read(file)
  file_lines = File.readlines(file)
  file_diff = git.diff_for_file(file)

  # Raise warning if outdated terminology found
  test = general_outdated_terminology?(file, file_lines); warnings << test if test

  # Look for out of place JSON files
  test = code_json_bad_location?(file); failures << test if test

  # Lint test JSON files
  test = code_json_errors?(file); failures << test if test

  # Output final list of failures and warnings
  fail "### **#{file}**\n\n#{failures.join("\n\n---\n\n")}" if !failures.empty?
  warn "### **#{file}**\n\n#{warnings.join("\n\n---\n\n")}" if !warnings.empty?
end

puts Time.now.strftime("%H:%M:%S.%L") + " * Testing all changed YAML files..."

changed_yaml_files.each do |file|
  puts Time.now.strftime("%H:%M:%S.%L") + " ** Testing " + file + "..."

  warnings = []
  failures = []

  # Preread file to avoid reading it multiple times for each method
  file_text = File.read(file)
  file_lines = File.readlines(file)
  file_diff = git.diff_for_file(file)

  # Raise warning if outdated terminology found
  test = general_outdated_terminology?(file, file_lines); warnings << test if test

  # Look for out of place YAML files
  test = code_yaml_bad_location?(file); failures << test if test

  # Lint test YAML files
  test = code_yaml_errors?(file); failures << test if test

  # Output final list of failures and warnings
  fail "### **#{file}**\n\n#{failures.join("\n\n---\n\n")}" if !failures.empty?
  warn "### **#{file}**\n\n#{warnings.join("\n\n---\n\n")}" if !warnings.empty?
end

###############################################################################
# Markdown Testing
###############################################################################

puts Time.now.strftime("%H:%M:%S.%L") + " * Testing all changed misc MD files..."

# Check Markdown files for issues for each file
changed_md_files.each do |file|
  puts Time.now.strftime("%H:%M:%S.%L") + " ** Testing " + file + "..."

  warnings = []
  failures = []

  # Preread file to avoid reading it multiple times for each method
  file_text = File.read(file)
  file_lines = File.readlines(file)
  file_diff = git.diff_for_file(file)

  # Run aspell spell check on file
  test = general_spellcheck?(file); warnings << test if test

  # Raise warning if outdated terminology found
  test = general_outdated_terminology?(file, file_lines); warnings << test if test

  # Raise error if the file contains any bad urls
  test = general_bad_urls?(file, file_diff); failures << test if test

  # Raise error if improper markdown is found via linter
  test = general_bad_markdown?(file); failures << test if test

  # Output final list of failures and warnings
  fail "### **#{file}**\n\n#{failures.join("\n\n---\n\n")}" if !failures.empty?
  warn "### **#{file}**\n\n#{warnings.join("\n\n---\n\n")}" if !warnings.empty?
end

###############################################################################
# Policy Testing
###############################################################################

puts Time.now.strftime("%H:%M:%S.%L") + " * Testing all changed Policy Template files..."

# Check policies for issues for each file
changed_pt_files.each do |file|
  puts Time.now.strftime("%H:%M:%S.%L") + " ** Testing " + file + "..."

  # Run policy through various methods that test for problems.
  # These methods will return false if no problems are found.
  # Otherwise, they return the warning or error message that should be raised.
  warnings = []
  failures = []

  # Preread file to avoid reading it multiple times for each method
  file_parsed = PolicyParser.new
  file_parsed.parse(file)
  file_text = File.read(file)
  file_lines = File.readlines(file)
  file_diff = git.diff_for_file(file)

  # Run policy through fpt testing. Only raise error if there is a syntax error.
  test = policy_fpt_syntax_error?(file); failures << test if test

  # Raise error if policy filename/path contains any uppercase letters
  test = policy_bad_filename_casing?(file); failures << test if test

  # Raise warning if policy's name has changed
  test = policy_name_changed?(file, file_diff); warnings << test if test

  # Output final list of failures and warnings
  fail "### **#{file}**\n\n#{failures.join("\n\n---\n\n")}" if !failures.empty?
  warn "### **#{file}**\n\n#{warnings.join("\n\n---\n\n")}" if !warnings.empty?
end
