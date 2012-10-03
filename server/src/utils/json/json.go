/**
 * Created with IntelliJ IDEA.
 * User: trungpham
 * Date: 9/23/12
 * Time: 4:09 PM
 * To change this template use File | Settings | File Templates.
 */
package json

import (
	"encoding/json"
	"io/ioutil"
	"fmt"
	"errors"
)


func ReadJsonFile(filePath string)(result map[string]interface{}, err error){
	rawData, err := ioutil.ReadFile(filePath)

	if nil == err{

		if err := json.Unmarshal(rawData, &result); err != nil{
			return nil, errors.New(fmt.Sprintf("Cannot parse config file: %v", filePath))
		}
	}else{
		return nil, errors.New(fmt.Sprintf("Cannot load config file: %v", filePath))
	}

	return result, nil
}




