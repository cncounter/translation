# How Do SSDs Work?


![NandFlash](https://www.extremetech.com/wp-content/uploads/2012/06/NandFlash-640x353.png)

Here at ExtremeTech, we’ve often discussed the difference between different types of NAND structures — [vertical NAND](http://www.extremetech.com/computing/195536-samsung-850-evo-ssd-high-performance-durable-3d-nand-hits-the-mainstream) versus planar, or multi-level cell (MLC) versus [triple-level cells](http://www.extremetech.com/computing/103873-ocz-to-launch-lower-cost-triple-cell-ssd-despite-endurance-performance-trade-offs) (TLC). Now, let’s talk about the more basic relevant question: How do SSDs work in the first place, and how do they compare with newer technologies, like Intel [Optane](https://www.extremetech.com/tag/optane)?

To understand how and why SSDs are different from spinning discs, we need to talk a little bit about hard drives. A hard drive stores data on a series of spinning magnetic disks called platters. There’s an actuator arm with read/write heads attached to it. This arm positions the read-write heads over the correct area of the drive to read or write information.

Because the drive heads must align over an area of the disk in order to read or write data (and the disk is constantly spinning), there’s a non-zero wait time before data can be accessed. The drive may need to read from multiple locations in order to launch a program or load a file, which means it may have to wait for the platters to spin into the proper position multiple times before it can complete the command. If a drive is asleep or in a low-power state, it can take several seconds more for the disk to spin up to full power and begin operating.

From the very beginning, it was clear that hard drives couldn’t possibly match the speeds at which CPUs could operate. Latency in HDDs is measured in milliseconds, compared with nanoseconds for your typical CPU. One millisecond is 1,000,000 nanoseconds, and it typically takes a hard drive 10-15 milliseconds to find data on the drive and begin reading it. The hard drive industry introduced smaller platters, on-disk memory caches, and faster spindle speeds to counteract this trend, but there’s only so fast drives can spin. Western Digital’s 10,000 RPM VelociRaptor family is the fastest set of drives ever built for the consumer market, while some enterprise drives spun up to 15,000 RPM. The problem is, even the fastest spinning drive with the largest caches and smallest platters are still achingly slow as far as your CPU is concerned.

### How SSDs Are Different

> *“If I had asked people what they wanted, they would have said faster horses.” — Henry Ford*

Solid-state drives are called that specifically because they don’t rely on moving parts or spinning disks. Instead, data is saved to a pool of NAND flash. NAND itself is made up of what are called floating gate transistors. Unlike the transistor designs used in DRAM, which must be refreshed multiple times per second, NAND flash is designed to retain its charge state even when not powered up. This makes NAND a type of non-volatile memory.

![Flash cell structure](http://www.extremetech.com/wp-content/uploads/2015/07/Flash_cell_structure.svg_1.png)

The diagram above shows a simple flash cell design. Electrons are stored in the floating gate, which then reads as charged “0” or not-charged “1.” Yes, in NAND flash, a 0 means data is stored in a cell — it’s the opposite of how we typically think of a zero or one. NAND flash is organized in a grid. The entire grid layout is referred to as a block, while the individual rows that make up the grid are called a page. Common page sizes are 2K, 4K, 8K, or 16K, with 128 to 256 pages per block. Block size therefore typically varies between 256KB and 4MB.

One advantage of this system should be immediately obvious. Because SSDs have no moving parts, they can operate at speeds far above those of a typical HDD. The following chart shows the access latency for typical storage mediums given in microseconds.

![SSD-Latency](http://www.extremetech.com/wp-content/uploads/2015/07/SSD-Latency.png)]

> Image by [CodeCapsule](http://codecapsule.com/2014/02/12/coding-for-ssds-part-2-architecture-of-an-ssd-and-benchmarking/)

NAND is nowhere near as fast as main memory, but it’s multiple orders of magnitude faster than a hard drive. While write latencies are significantly slower for NAND flash than read latencies, they still outstrip traditional spinning media.

There are two things to notice in the above chart. First, note how adding more bits per cell of NAND has a significant impact on the memory’s performance. It’s worse for writes as opposed to reads — typical triple-level-cell (TLC) latency is 4x worse compared with single-level cell (SLC) NAND for reads, but 6x worse for writes. Erase latencies are also significantly impacted. The impact isn’t proportional, either — TLC NAND is nearly twice as slow as MLC NAND, despite holding just 50% more data (three bits per cell, instead of two).

![TLC NAND](http://www.extremetech.com/wp-content/uploads/2015/07/TLCNAND.png)]

> TLC NAND voltages

The reason TLC NAND is slower than MLC or SLC has to do with how data moves in and out of the NAND cell. With SLC NAND, the controller only needs to know if the bit is a 0 or a 1. With MLC NAND, the cell may have four values — 00, 01, 10, or 11. With TLC NAND, the cell can have eight values. Reading the proper value out of the cell requires the memory controller to use a precise voltage to ascertain whether any particular cell is charged.

### Reads, Writes, and Erasure

One of the functional limitations of [SSDs](http://www.extremetech.com/tag/ssds) is while they can read and write data very quickly *to an empty drive*, overwriting data is much slower. This is because while SSDs read data at the page level (meaning from individual rows within the NAND memory grid) and can write at the page level, assuming surrounding cells are empty, they can only erase data at the block level. This is because the act of erasing NAND flash requires a high amount of voltage. While you can theoretically erase NAND at the page level, the amount of voltage required stresses the individual cells around the cells that are being re-written. Erasing data at the block level helps mitigate this problem.

The only way for an SSD to update an existing page is to copy the contents of the entire block into memory, erase the block, and then write the contents of the old block + the updated page. If the drive is full and there are no empty pages available, the SSD must first scan for blocks that are marked for deletion but that haven’t been deleted yet, erase them, and then write the data to the now-erased page. This is why SSDs can become slower as they age — a mostly-empty drive is full of blocks that can be written immediately, a mostly-full drive is more likely to be forced through the entire program/erase sequence.

If you’ve used SSDs, you’ve likely heard of something called “garbage collection.” Garbage collection is a background process that allows a drive to mitigate the performance impact of the program/erase cycle by performing certain tasks in the background. The following image steps through the garbage collection process.

![Garbage collection](http://www.extremetech.com/wp-content/uploads/2015/07/Diagram-1.png)

> Image courtesy of Wikipedia

Note in this example, the drive has taken advantage of the fact that it can write very quickly to empty pages by writing new values for the first four blocks (A’-D’). It’s also written two new blocks, E and H. Blocks A-D are now marked as stale, meaning they contain information the drive has marked as out-of-date. During an idle period, the SSD will move the fresh pages over to a new block, erase the old block, and mark it as free space. This means the next time the SSD needs to perform a write, it can write directly to the now-empty Block X, rather than performing the program/erase cycle.

The next concept I want to discuss is TRIM. When you delete a file from Windows on a typical hard drive, the file isn’t deleted immediately. Instead, the operating system tells the hard drive it can overwrite the physical area of the disk where that data was stored the next time it needs to perform a write. This is why it’s possible to undelete files (and why deleting files in Windows doesn’t typically clear much physical disk space until you empty the recycling bin). With a traditional HDD, the OS doesn’t need to pay attention to where data is being written or what the relative state of the blocks or pages is. With an SSD, this matters.

The TRIM command allows the operating system to tell the SSD it can skip rewriting certain data the next time it performs a block erase. This lowers the total amount of data the drive writes and increases SSD longevity. Both reads and writes damage NAND flash, but writes do far more damage than reads. Fortunately, block-level longevity has not proven to be an issue in modern NAND flash. More data on [SSD longevity](http://www.extremetech.com/computing/201064-which-ssds-are-the-most-reliable-massive-study-sheds-some-light), courtesy of the Tech Report, can be found here.

The last two concepts we want to talk about are wear leveling and write amplification. Because SSDs write data to pages but erase data in blocks, the amount of data being written to the drive is always larger than the actual update. If you make a change to a 4KB file, for example, the entire block that 4K file sits within must be updated and rewritten. Depending on the number of pages per block and the size of the pages, you might end up writing 4MB worth of data to update a 4KB file. Garbage collection reduces the impact of write amplification, as does the TRIM command. Keeping a significant chunk of the drive free and/or manufacturer over-provisioning can also reduce the impact of write amplification.

Wear leveling refers to the practice of ensuring certain NAND blocks aren’t written and erased more often than others. While wear leveling increases a drive’s life expectancy and endurance by writing to the NAND equally, it can actually increase write amplification. In other to distribute writes evenly across the disk, it’s sometimes necessary to program and erase blocks even though their contents haven’t actually changed. A good wear leveling algorithm seeks to balance these impacts.

### The SSD Controller

It should be obvious by now SSDs require much more sophisticated control mechanisms than hard drives do. That’s not to diss magnetic media — I actually think HDDs deserve more respect than they are given. The mechanical challenges involved in balancing multiple read-write heads nanometers above platters that spin at 5,400 to 10,000 RPM are nothing to sneeze at. The fact that HDDs perform this challenge while pioneering new methods of recording to magnetic media and eventually wind up selling drives at 3-5 cents per gigabyte is simply incredible.

![SSD controller](http://www.extremetech.com/wp-content/uploads/2015/07/2006640.jpg)

> A typical SSD controller

SSD *controllers*, however, are in a class by themselves. They often have a DDR3 memory pool to help with managing the NAND itself. Many drives also incorporate single-level cell caches that act as buffers, increasing drive performance by dedicating fast NAND to read/write cycles. Because the NAND flash in an SSD is typically connected to the controller through a series of parallel memory channels, you can think of the drive controller as performing some of the same load balancing work as a high-end storage array — SSDs don’t deploy RAID internally but wear leveling, garbage collection, and SLC cache management all have parallels in the big iron world.

Some drives also use data compression algorithms to reduce the total number of writes and improve the drive’s lifespan. The SSD controller handles error correction, and the algorithms that control for single-bit errors have become increasingly complex as time has passed.

Unfortunately, we can’t go into too much detail on SSD controllers because companies lock down their various secret sauces. Much of NAND flash’s performance is determined by the underlying controller, and companies aren’t willing to lift the lid too far on how they do what they do, lest they hand a competitor an advantage.

### The Road Ahead

NAND flash offers an enormous improvement over hard drives, but it isn’t without its own drawbacks and challenges. Drive capacities and price-per-gigabyte are expected to continue to rise and fall respectively, but there’s little chance SSDs will catch hard drives in price-per-gigabyte. Shrinking process nodes are a significant challenge for NAND flash — while most hardware improves as the node shrinks, NAND becomes more fragile. Data retention times and write performance are intrinsically lower for 20nm NAND than 40nm NAND, even if data density and total capacity are vastly improved.

Thus far, SSD manufacturers have delivered better performance by offering faster data standards, more bandwidth, and more channels per controller — plus the use of SLC caches we mentioned earlier. Nonetheless, in the long run, it’s assumed NAND will be replaced by something else.

What that something else will look like is still open for debate. Both [magnetic RAM](http://www.extremetech.com/computing/193065-mram-manufacturer-everspin-teams-up-with-globalfoundries-to-build-magnetic-memory) and [phase change memory](http://www.extremetech.com/extreme/182096-ibm-demonstrates-next-gen-phase-change-memory-thats-up-to-275-times-faster-than-your-ssd) have presented themselves as candidates, though both technologies are still in early stages and must overcome significant challenges to actually compete as a replacement to NAND. Whether consumers would notice the difference is an open question. If you’ve upgraded from NAND to an SSD and then upgraded to a faster SSD, you’re likely aware the gap between HDDs and SSDs is much larger than the SSD-to-SSD gap, even when upgrading from a relatively modest drive. Improving access times from milliseconds to microseconds matters a great deal, but improving them from microseconds to nanoseconds might fall below what humans can really perceive in most cases.

Intel’s 3D XPoint (marketed as Intel Optane) has emerged as one potential challenger to NAND flash, and the only current alternative technology in mainstream production. Optane SSDs offer similar sequential performance to current NAND flash drives, but with vastly better performance at low drive queues. Drive latency is also roughly half of NAND flash (10 microseconds, versus 20) and vastly higher endurance (30 full drive-writes per day, compared with 10 full drive writes per day for a high-end Intel SSD).

![Optane1](https://www.extremetech.com/wp-content/uploads/2016/10/Optane1.png)

> Intel Optane performance targets

The first [Optane SSDs](https://www.extremetech.com/computing/265254-intel-launches-new-optane-800p-m-2-ssds-consumer-systems) have debuted as excellent add-ons for Kaby Lake and Coffee Lake. Still, Optane is still too expensive to match NAND flash, which benefits from substantial economies of scale, but this could change in the future. NAND will stay king of the hill for at least the next 3-4 years. But past that point we could see Optane starting to replace it in volume, depending on how Intel and Micron scale the technology and how well 3D NAND flash continues to expand its cell layers (64-layer NAND is shipping from multiple players), with roadmaps for 96 and even 128 layers on the horizon.

Check out our [ExtremeTech Explains](http://www.extremetech.com/tag/extremetech-explains) series for more in-depth coverage of today’s hottest tech topics.

Now read: [The Worst CPUs Ever Built](https://www.extremetech.com/computing/274650-the-worst-cpus-ever-made), [Happy 40th Anniversary to the Original Intel 8086](https://www.extremetech.com/computing/270926-happy-40th-anniversary-to-the-original-8086-and-the-x86-architecture), and [The Myths of Moore’s Law](https://www.extremetech.com/extreme/223022-the-myths-of-moores-law)




<https://www.extremetech.com/extreme/210492-extremetech-explains-how-do-ssds-work>
