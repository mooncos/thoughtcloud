---
title: NVIDIA on Linux
tags: 
date: 2024-03-26
lastmod: 2024-05-19
draft: false
---
The year is 2024. NVIDIA on linux is in a usable state! Of course, there are still many pitfalls and options required for a good experience. This page documents every configuration trick I've used and has all the resources that you need to use it yourself.

## My Setup
I have an RTX 3060 Ti connected to an eGPU dock that I use with my Framework laptop over Thunderbolt. More info [[Projects/my-computer|here]].

Having an eGPU means that I need a way to configure the egpu on boot so that I can properly use the external display when not docked. There are two important programs to note:
- [egpu-switcher](https://github.com/hertg/egpu-switcher): On boot, checks whether the eGPU is detected and adds an xorg config designed to allow the display session to start if so. Can run hook scripts both when the egpu is detected and not detected, which allows customization.
	- I use the hook scripts to overwrite the default xorg config file that it adds with the one in [[#X11|the X11 section]].
- [all-ways-egpu](https://github.com/ewagner12/all-ways-egpu): On boot, configures the eGPU as the primary display under Wayland. Lots of CLI customization. I've had the best experience using Method 2 and Method 3 at the same time.
### Kernel Drivers
Start by installing the nvidia driver that your distro bundles (or a community project).

**If you use a non-default kernel**: make sure that the driver uses **dkms**, not **\[a\]kmods**.

**If your workflow requires the NVENC codec**: opt for the package containing all proprietary blobs rather than the package with the open source kernel driver.

I recommend adding `nvidia.NVreg_OpenRmEnableUnsupportedGpus=1 nvidia.NVreg_PreserveVideoMemoryAllocations=1 nvidia_drm.modeset=1` to your kernel parameters. These help with hardware detection, sleep, and display configuration, respectively.

You should also blacklist the Noveau video driver. You can do this with kernel parameters through `modprobe.blacklist=noveau` (effective immediately), or in your module config files (effective after rebuilding the initramfs).
## X11
In my opinion (and with my hardware), X11 is more usable right now with nvidia cards. 

This config recipe will set the same options for every device using the nvidia drivers:

```xorg
# File: /etc/X11/xorg.conf.d/10-nvidia.conf
Section "OutputClass"
    Identifier "nvidia"
    MatchDriver "nvidia-drm"
    Driver "nvidia"
    Option "AllowEmptyInitialConfiguration" # Prevent crashes on startup
    Option "SLI" "Auto" # Configure system based on no. of gpus present
    Option "BaseMosaic" "on" # Optimize multi-display rendering
    Option "TripleBuffer" "off" # Unnecessary performance overhead
    Option "ForceFullCompositionPipeline" "on" # Fixes screen tearing. 
    # Option "ForceCompositionPipeline" "on" # If you still experience tearing with ForceFullCompositionPipeline, turn that setting off and turn this one on
    # Option "CoolBits" "28" # Only necessary for overclocking/undervolting. 
                             # If the GPU is too old, use the value 20 instead.
                             # If you don't want to overclock, you don't need to touch this line!
EndSection
```

The options for the nvidia driver are documented [here](https://download.nvidia.com/XFree86/Linux-x86_64/396.51/README/xconfigoptions.html).
## Wayland
On both Gnome and Plasma, I've managed to get the display working on 6.x kernels and 5xx drivers as long as I've enabled `all-ways-egpu` and kernel modesetting. 

For more stable logins, ensure that your display manager (GDM for gnome, defaults to SDDM on Plasma) is using Wayland.
```
# In /etc/gdm/custom.conf
[daemon]
WaylandEnable=true
```

```
# In /etc/sddm.conf.d/sddm.conf
# [Wayland]
# EnableHiDPI=true # 4K, framework laptop, etc

[General]
DisplayServer=wayland
```

XWayland will have degraded performance on NVIDIA cards. On Arch specifically, some people have found success mitigating this with [wayland-protocols](https://archlinux.org/packages/extra/any/wayland-protocols/), { *merged -ed.* } ~~mutter-vrr on GNOME~~, and [xorg-xwayland-git](https://aur.archlinux.org/packages/xorg-xwayland-git). That combination didn't work for me when I tried it in April 2024, and with a few other wayland issues compounding the poor performance, I swapped back to X11. I do periodically check on Wayland though, so expect updates.
## More Resources
Allow me to dump every other page that I've needed to comb through for a working nvidia card.
- [Archwiki - NVIDIA](https://wiki.archlinux.org/title/NVIDIA) (useful on more distros than Arch!)