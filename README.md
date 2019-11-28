# Lightning_Load

Load huge number (over 100k) of images in lightning speed.

Uesd a 3-level Skiplist to display images, placeholder1, placeholder2 in 3 different layers.

### Run the program

Ensure npm installed

In folder, run: `npm install`

After finishing the installation, run: `npm start`

Then you may check the result in: localhost:3000

Note that the first time to open it may take 10 ~ 20 seconds after npm start, 
but it will be much faster after that.

### Performance

Normal scrolling should need no loading time, and jump on the scroll bar may take around 1 second to load if internet and hardware are relatively good.
