#pragma once
#include <string>

class Configer {
 protected:
  Configer() = default;
  ~Configer() = default;

 public:
  std::string getData(const std::string key);
  void saveData(const std::string& key, const std::string& val);
  static Configer& instance();
};
