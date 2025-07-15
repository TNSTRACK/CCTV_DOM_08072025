# Mock Video Files for DOM CCTV MVP

## Purpose
This directory contains placeholder video files for testing the Video.js integration in the DOM CCTV MVP system.

## Critical Note from PRP
⚠️ **Video.js requires real video files, not empty placeholders**

## Setup Instructions for Development

### Option 1: Create Test Videos with FFmpeg (Recommended)
```bash
# Generate short test videos (10 seconds each)
ffmpeg -f lavfi -i testsrc=duration=10:size=1920x1080:rate=30 -c:v libx264 truck_arrival_001.mp4
ffmpeg -f lavfi -i testsrc=duration=15:size=1920x1080:rate=30 -c:v libx264 truck_arrival_002.mp4
ffmpeg -f lavfi -i testsrc=duration=12:size=1920x1080:rate=30 -c:v libx264 truck_arrival_003.mp4
ffmpeg -f lavfi -i testsrc=duration=8:size=1920x1080:rate=30 -c:v libx264 truck_arrival_004.mp4
ffmpeg -f lavfi -i testsrc=duration=20:size=1920x1080:rate=30 -c:v libx264 truck_arrival_005.mp4
```

### Option 2: Download Sample Videos
```bash
# Download public domain sample videos
wget -O truck_arrival_001.mp4 "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
wget -O truck_arrival_002.mp4 "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
```

### Option 3: Use Big Buck Bunny Samples
```bash
# Big Buck Bunny - Open source test video
wget -O truck_arrival_001.mp4 "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
```

## Required Files for MVP Testing
The following video files should be present for full functionality:

1. `truck_arrival_001.mp4` - ABC123 license plate event
2. `truck_arrival_002.mp4` - DEFG45 license plate event  
3. `truck_arrival_003.mp4` - HIJ678 license plate event
4. `truck_arrival_004.mp4` - KLMN90 license plate event
5. `truck_arrival_005.mp4` - OPQ123 license plate event

## Video Specifications
- **Format:** MP4 (H.264)
- **Resolution:** 1920x1080 (Full HD) preferred, 1280x720 minimum
- **Duration:** 8-20 seconds each
- **Size:** <10MB per file for development
- **Frame Rate:** 30fps recommended

## Integration with Mock Data
These video filenames are referenced in the mock data generation:
- `examples/mock-data/generators.ts` - Sets videoFilename field
- Database seed will reference these files
- Express static middleware will serve from this directory

## Video Player Testing Requirements
The videos must support:
- ✅ Basic playback controls (play/pause/seek)
- ✅ Zoom functionality (2x, 3x, 4x as per MVP scope)
- ✅ Responsive sizing for different screen sizes
- ✅ Fast loading and seeking for user experience

## File Naming Convention
Use the pattern: `truck_arrival_XXX.mp4` where XXX is a 3-digit number.

This matches the mock data generator which creates filenames like:
```typescript
videoFilename: `truck_arrival_${(index + 1).toString().padStart(3, '0')}.mp4`
```

## Security Note
These are development/testing files only. Production videos would come from:
- Hikvision camera recordings (Phase 2)
- Proper video management system
- Secure video storage with access controls

## Quick Setup Script
```bash
#!/bin/bash
# Run this script to quickly setup test videos
cd /path/to/dom-cctv-mvp/uploads/videos

# Create 5 test videos with FFmpeg (if available)
for i in {1..5}; do
  if command -v ffmpeg &> /dev/null; then
    ffmpeg -f lavfi -i "testsrc=duration=10:size=1920x1080:rate=30" \
           -c:v libx264 -preset fast -crf 23 \
           "truck_arrival_$(printf "%03d" $i).mp4"
  else
    echo "FFmpeg not found. Please install FFmpeg or manually add video files."
    break
  fi
done

echo "Mock video setup complete!"
```