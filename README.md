# generator-ho
[![Build Status](https://travis-ci.org/stylesuxx/generator-ho.svg)](https://travis-ci.org/stylesuxx/generator-ho)

>Generator for aliased generator functionality.

## Installation
Install the generator globally:
```Bash
sudo npm install generator-ho -g
```

## Usage
To use **ho** with your project just add a *ho.json* file describing your aliases:
```JSON
{
  "command": {
    "generator": "some-generator",
    "subgen": "sub",
    "parameters": [ "name"]
  }
}
```

subgen and parameters are optional.

### Listing available commands
To list commands that may be invoked via *ho*, just run:
```Bash
yo ho --help
```

### Invoking commands
You can now invoke those aliased commands by running:
```Bash
yo ho command arg1 arg2
```

## Example
If *ho.json* looks like this:
```JSON
{
  "action": {
    "generator": "react-webpack-redux",
    "subgen": "action",
    "parameters": [ "name" ]
  },
  "reducer": {
    "generator": "react-webpack-redux",
    "subgen": "reducer",
    "parameters": [ "name" ]
  },
  "component": {
    "generator": "react-webpack",
    "subgen": "component",
    "parameters": [ "name" ]
  }
}
```
it will produce a help like this:
```Bash
Usage:
  yo ho:app [options] <command>

Options:
  -h,   --help          # Print the generator's options and usage
        --skip-cache    # Do not remember prompt answers             Default: false
        --skip-install  # Do not automatically install dependencies  Default: false

Arguments:
  command  # Available commands to invoke:
           + action <name> (yo react-webpack-redux:action <name>)
           + reducer <name> (yo react-webpack-redux:reducer <name>)
           + component <name> (yo react-webpack:component <name>)

           Type: String  Required: true

```
and will allow for the following commands to be executed:
```Bash
yo ho action addItem
yo ho reducer item
yo ho component ItemList
```

## [MIT](https://opensource.org/licenses/MIT) License
Copyright (c) 2015 Chris Landa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
