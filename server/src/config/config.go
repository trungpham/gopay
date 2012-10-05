/**
 * Created with IntelliJ IDEA.
 * User: trungpham
 * Date: 9/22/12
 * Time: 9:45 PM
 * To change this template use File | Settings | File Templates.
 */
package config

import (
	"utils/json"
)

type Config struct {
	filePath string
	data     map[string]interface{}
}

func NewConfig(filePath string) (config *Config) {
	config = &Config{filePath: filePath}
	config.Load()
	return config
}

func (config *Config) Load() {
	data, err := json.ReadJsonFile(config.filePath)
	if err != nil {
		panic(err)
	} else {
		config.data = data
	}
}

func (config *Config) Get(key string) (value interface{}) {
	return config.data[key]
}
