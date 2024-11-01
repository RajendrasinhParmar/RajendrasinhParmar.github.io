---
title: Keyboard Mapping in Linux with xmodmap
description: Customise Keyboard key mapping in Linux if the keyboard layout has different buttons associated with different actions. this mainly happens with Alt, Ctrl and Super(Windows) keys
pubDatetime: 2024-11-01T12:13:53+05:30
postSlug: keyboard-mapping-in-Linux-with-xmodmap
featured: false
draft: false
tags:
  - linux
  - terminal
---

![tp.web.random_picture](https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900&h=350)

Customise Keyboard key mapping in Linux if the keyboard layout has different buttons associated with other actions. This mainly happens with the Alt, Ctrl and Super(Windows) keys.

## Table of contents

## TL;DR

`xmodmap` is a utility for modifying keymaps and pointer button mappings in X. We can easily remap the keys in a Linux-like system. For our use case, we can remap the Alt and Super(Windows) keys to the desired keys.

### Temporary remapping

- Run `xmodmap -pke` to see the current key mappings'
- Run `xmodmap -e "keycode 64 = Alt_L"` to remap the key with keycode 64 to Alt_L
- Run `xmodmap -e "keycode 133 = Super_L"` to remap the key with keycode 133 to Super_L

### Mapping with proper configuration file

- Create or update file `~/.Xmodmap` with the key mappings that we want to change
- Add the following lines to the file

```
clear Mod1
clear Mod4
keycode 133 = Alt_L
keycode 108 = Alt_R
keycode 64 = Super_L
keycode 134 = Super_R
add Mod1 = Alt_L Alt_R
add Mod4 = Super_L Super_R
```

- Run `xmodmap ~/.Xmodmap` to apply the changes. This will apply the changes to the current session. To make the changes permanent, add the command to the startup script of the desktop environment.

## Introduction

I've recently switched to a new keyboard and the layout of the keyboard is different than the previous one. The new keyboard has a different design for the Alt and Super(Windows) keys. The Alt key is mapped to the Super key function and vice versa. This is causing a lot of confusion while using the keyboard shortcuts. I wanted to remap the keys to the desired keys. I've found that xmodmap is the utility that can be used to remap the keys in a Linux-like system.

## Get current key mappings

To get the current key mappings, we can use the `xmodmap -pke` command. This will print the current key mappings to the terminal. We can use this output to find the keycodes of the keys that we want to remap.

```bash
$ xmodmap -pke
```

For our use case, we want to remap the Alt and Super(Windows) keys. Execute the following command and grep the output to find the keycodes of the keys that we want to remap.

```bash
$ xmodmap -pke| egrep  -e '(Alt|Super)'
# Output
# keycode  64 = Super_L NoSymbol Super_L NoSymbol Super_L
# keycode 108 = Alt_R NoSymbol Alt_R
# keycode 133 = Alt_L NoSymbol Alt_L NoSymbol Alt_L
# keycode 134 = Super_R NoSymbol Super_R NoSymbol Super_R
# keycode 204 = NoSymbol Alt_L NoSymbol Alt_L NoSymbol Alt_L
# keycode 206 = NoSymbol Super_L NoSymbol Super_L NoSymbol Super_L
```

From the above output, we can see that the keycodes for the Alt and Super keys are 133 and 64 respectively. For my current keyboard layout, I want to remap the Alt key to the Super key and vice versa. So I will remap the key with keycode 133 to Super_L and the key with keycode 64 to Alt_L.

To get current modifiers, we can use the `xmodmap -pm` command.

```bash
$ xmodmap -pm
# Output
# xmodmap:  up to 4 keys per modifier, (keycodes in parentheses):
# shift       Shift_L (0x32),  Shift_R (0x3e)
# lock
# control     Control_L (0x25),  Control_R (0x69)
# mod1        Alt_L (0x40),  Meta_L (0xcd)
# mod2        Num_Lock (0x4d)
# mod3
# mod4        Super_L (0x85),  Super_R (0x86),  Super_L (0xce),  Hyper_L (0xcf)
# mod5        ISO_Level3_Shift (0x5c),  Mode_switch (0xcb)
```

## Remap the keys

For temporary remapping of the keys, we can use the `xmodmap -e` command. However, this will only apply the changes to the current session. To make the changes permanent, we can create a configuration file `~/.Xmodmap` and add the key mappings to this file.

Temporary remapping of the keys. This is to test the key mappings.

```bash
$ xmodmap -e "keycode 64 = Alt_L"
$ xmodmap -e "keycode 133 = Super_L"
```

> Note: It might be possible that the Alt button does not start working as expected. This is due to the fact that the `Alt` key is also used as the `Meta` key in some of the applications. To fix this issue, we need to clear the `Mod1` and `Mod4` modifiers and then add the `Alt` and `Super` keys to the `Mod1` and `Mod4` modifiers respectively.

## `.Xmodmap` configuration file for permanent key mappings

Once the above setup is verified and working as expected, we can add the key mappings to the `~/.Xmodmap` file.

```bash
$ nano ~/.Xmodmap
```

Add the following lines to the file.

```
clear Mod1
clear Mod4
keycode 133 = Alt_L
keycode 108 = Alt_R
keycode 64 = Super_L
keycode 134 = Super_R
add Mod1 = Alt_L Alt_R
add Mod4 = Super_L Super_R
```

In the above configuration file, we are clearing the `Mod1` and `Mod4` modifiers before reassigning the keys.

## Apply the changes

To apply the changes, we can run the following command.

```bash
$ xmodmap ~/.Xmodmap
```

This will apply the changes to the current session. To make the changes permanent, we need to add the above command to the startup script of the desktop environment.

## Adding the command to the startup script

To make the changes permanent, we need to add the `xmodmap ~/.Xmodmap` command to the startup script of the desktop environment.

For Ubuntu, we will be using startup applications to add the command. Open the startup applications and add the command to the list of startup applications. To open the start-up applications, search for `Startup Applications` in the application menu. Click the `Add` button and add the command `bash -c '[ -f "$HOME/.Xmodmap" ] && xmodmap "$HOME/.Xmodmap"'` to the command field.

![Startup Application Entry](@assets/images/startup-program_for_keymap.png)

Once done with the above steps, restart the system and the changes should be applied.

## Conclusion

In this post, we have seen how to remap the keys in a Linux-like system using the `xmodmap` utility. We have seen how to get the current key mappings and remap the keys temporarily and permanently. We have also seen how to add the command to the startup script of the desktop environment to make the changes permanent.
