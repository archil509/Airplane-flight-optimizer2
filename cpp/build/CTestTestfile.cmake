# CMake generated Testfile for 
# Source directory: C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp
# Build directory: C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/build
# 
# This file includes the relevant testing commands required for 
# testing this directory and lists subdirectories to be tested as well.
if(CTEST_CONFIGURATION_TYPE MATCHES "^([Dd][Ee][Bb][Uu][Gg])$")
  add_test(FlightEngineUnitTests "C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/build/Debug/test_flight_engine.exe")
  set_tests_properties(FlightEngineUnitTests PROPERTIES  _BACKTRACE_TRIPLES "C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/CMakeLists.txt;30;add_test;C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/CMakeLists.txt;0;")
elseif(CTEST_CONFIGURATION_TYPE MATCHES "^([Rr][Ee][Ll][Ee][Aa][Ss][Ee])$")
  add_test(FlightEngineUnitTests "C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/build/Release/test_flight_engine.exe")
  set_tests_properties(FlightEngineUnitTests PROPERTIES  _BACKTRACE_TRIPLES "C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/CMakeLists.txt;30;add_test;C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/CMakeLists.txt;0;")
elseif(CTEST_CONFIGURATION_TYPE MATCHES "^([Mm][Ii][Nn][Ss][Ii][Zz][Ee][Rr][Ee][Ll])$")
  add_test(FlightEngineUnitTests "C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/build/MinSizeRel/test_flight_engine.exe")
  set_tests_properties(FlightEngineUnitTests PROPERTIES  _BACKTRACE_TRIPLES "C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/CMakeLists.txt;30;add_test;C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/CMakeLists.txt;0;")
elseif(CTEST_CONFIGURATION_TYPE MATCHES "^([Rr][Ee][Ll][Ww][Ii][Tt][Hh][Dd][Ee][Bb][Ii][Nn][Ff][Oo])$")
  add_test(FlightEngineUnitTests "C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/build/RelWithDebInfo/test_flight_engine.exe")
  set_tests_properties(FlightEngineUnitTests PROPERTIES  _BACKTRACE_TRIPLES "C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/CMakeLists.txt;30;add_test;C:/Users/admin/.gemini/antigravity/scratch/dijkstra-flight-optimizer/cpp/CMakeLists.txt;0;")
else()
  add_test(FlightEngineUnitTests NOT_AVAILABLE)
endif()
