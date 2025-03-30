# Mojicon CLI

![](https://tnantoka.github.io/mojicon-cli/demo.gif)

Mojicon is a CLI tool for creating icons using various characters and symbols with Google Fonts.

This is an OSS port of [mojicon.net](https://mojicon.net/), a web service that has been running since 2018.

## Features

- Supports Google Fonts
- Supports multilingual fonts
- Material Icons available
- Fonts are automatically downloaded and cached in `~/.mojicon/fonts`
- Customizable background color, text color, rounded corners, and more

## Usage

```sh
npx mojicon [options]

Options:
  -V, --version             output the version number
  -w, --width [width]       Icon width in pixels (default: "512")
  -h, --height [height]     Icon height in pixels (default: width)
  -c, --text-color [color]  Text color (#RRGGBB or #RGB format) (default:
                            "#000000")
  -b, --bg-color [color]    Background color (#RRGGBB or #RGB format) (default:
                            "#FFFFFF")
  --bg-alpha [alpha]        Background transparency (0-1) (default: "1")
  -r, --radius [radius]     Corner radius (default: "0")
  -o, --output [filename]   Output file path (default: "./icon.png")
  -m, --mode [mode]         Generation mode: text | icon (default: "text")
  -l, --label [label]       Text label or icon name (default: "A" for text,
                            "search" for icon)
  -f, --font [font]         Font name (default: "Roboto" for text, "Material
                            Icons" for icon)
  -s, --font-size [size]    Font size in pixels (default: "256")
  -v, --variant [variant]   Font variant (default: "Regular")
  -x, --x [x]               X position (default: "0")
  -y, --y [y]               Y position (default: "0")
  -a, --angle [angle]       Rotation angle in degrees (default: "0")
  -j, --json [filename]     a JSON file to configure all options
  --sample-json             output a sample JSON content
  --help                    display help for command
```

## Examples

### Text Mode

```sh
npx mojicon -w 256 -s 128 -m text -l A -o my-icon.png
```

| ![](https://tnantoka.github.io/mojicon-cli/my-icon.png) |
| ----- |

```sh
npx mojicon -w 256 -s 128 -m text -l あ -b #ddd -f "Noto Sans JP" -r 128 -o japanese-icon.png
```

| ![](https://tnantoka.github.io/mojicon-cli/japanese-icon.png) |
| ----- |

### Icon Mode

```sh
npx mojicon -w 256 -s 128 -m icon -l home -o home-icon.png
```

| ![](https://tnantoka.github.io/mojicon-cli/home-icon.png) |
| ----- |

```sh
npx mojicon -w 256 -s 128 -m icon -l home -f "material icons two tone" -o two-tone-icon.png
```

| ![](https://tnantoka.github.io/mojicon-cli/two-tone-icon.png) |
| ----- |

### Multiple Mode with JSON

```sh
npx mojicon --json multi-icon.json
```

| ![](https://tnantoka.github.io/mojicon-cli/multi-icon.png) |
| ----- |

#### multi-icon.json

```json
{
  "width": 256,
  "height": 256,
  "output": "./multi-icon.png",
  "items": [
    {
      "mode": "text",
      "label": "A",
      "font": "Roboto",
      "fontSize": 160,
      "variant": "Bold",
      "x": 0,
      "y": 0,
      "angle": 45
    },
    {
      "mode": "icon",
      "label": "circle",
      "font": "Material Icons Outlined",
      "fontSize": 256,
      "variant": "Regular",
      "x": 0,
      "y": 0,
      "angle": 0
    }
  ]
}
```

## Author

[@tnantoka](https://x.com/tnantoka)

## License

MIT
