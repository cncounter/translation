# How Do SSDs Work?

# 浅析SSD固态硬盘的运行原理

![NandFlash](https://www.extremetech.com/wp-content/uploads/2012/06/NandFlash-640x353.png)

Here at ExtremeTech, we’ve often discussed the difference between different types of NAND structures — [vertical NAND](http://www.extremetech.com/computing/195536-samsung-850-evo-ssd-high-performance-durable-3d-nand-hits-the-mainstream) versus planar, or multi-level cell (MLC) versus [triple-level cells](http://www.extremetech.com/computing/103873-ocz-to-launch-lower-cost-triple-cell-ssd-despite-endurance-performance-trade-offs) (TLC). Now, let’s talk about the more basic relevant question: How do SSDs work in the first place, and how do they compare with newer technologies, like Intel [Optane](https://www.extremetech.com/tag/optane)?

To understand how and why SSDs are different from spinning discs, we need to talk a little bit about hard drives. A hard drive stores data on a series of spinning magnetic disks called platters. There’s an actuator arm with read/write heads attached to it. This arm positions the read-write heads over the correct area of the drive to read or write information.

Because the drive heads must align over an area of the disk in order to read or write data (and the disk is constantly spinning), there’s a non-zero wait time before data can be accessed. The drive may need to read from multiple locations in order to launch a program or load a file, which means it may have to wait for the platters to spin into the proper position multiple times before it can complete the command. If a drive is asleep or in a low-power state, it can take several seconds more for the disk to spin up to full power and begin operating.

From the very beginning, it was clear that hard drives couldn’t possibly match the speeds at which CPUs could operate. Latency in HDDs is measured in milliseconds, compared with nanoseconds for your typical CPU. One millisecond is 1,000,000 nanoseconds, and it typically takes a hard drive 10-15 milliseconds to find data on the drive and begin reading it. The hard drive industry introduced smaller platters, on-disk memory caches, and faster spindle speeds to counteract this trend, but there’s only so fast drives can spin. Western Digital’s 10,000 RPM VelociRaptor family is the fastest set of drives ever built for the consumer market, while some enterprise drives spun up to 15,000 RPM. The problem is, even the fastest spinning drive with the largest caches and smallest platters are still achingly slow as far as your CPU is concerned.



在 ExtremeTech 网站上有一系列的文章在讨论不同类型NAND结构之间的区别

- [垂直结构 vertical NAND](http://www.extremetech.com/computing/195536-samsung-850-evo-ssd-high-performance-durable-3d-nand-hits-the-mainstream)
- 平面结构
- 多层单元 multi-level cell (MLC)
- [三层单元, TLC, triple-level cells](http://www.extremetech.com/computing/103873-ocz-to-launch-lower-cost-triple-cell-ssd-despite-endurance-performance-trade-offs)

本文主要介绍一些更底层的基础话题: SSD是如何运行的，与更新的 Intel [Optane](https://www.extremetech.com/tag/optane) 技术对比有何优劣？

要了解SSD与旋转磁盘有何不同以及为何不同，我们需要对硬盘进行一些讨论。硬盘驱动器将数据存储在一系列称为磁盘的旋转磁盘上。有一个带有读/写头的执行器臂。该臂将读写头放置在驱动器的正确区域上，以读取或写入信息。

由于驱动器磁头必须对齐磁盘的整个区域才能读取或写入数据（并且磁盘一直在旋转），因此访问数据的等待时间为非零。驱动器可能需要从多个位置读取才能启动程序或加载文件，这意味着它可能必须等待磁盘多次旋转到正确的位置才能完成命令。如果驱动器处于睡眠状态或处于低功率状态，则磁盘可能需要几秒钟的时间才能旋转至最大功率并开始运行。

从一开始就很明显，硬盘驱动器不可能与CPU的运行速度相匹配。 HDD的延迟以毫秒为单位，而典型CPU的延迟为纳秒。一毫秒是1,000,000纳秒，通常硬盘驱动器需要10-15毫秒才能在驱动器上找到数据并开始读取数据。硬盘行业引入了更小的磁盘，磁盘上的内存缓存以及更快的主轴速度来抵消这种趋势，但是只有如此之快的驱动器才能旋转。 Western Digital的10,000 RPM VelociRaptor系列是有史以来为消费市场打造的最快的驱动器，而某些企业级驱动器的转速高达15,000 RPM。问题是，就CPU而言，即使是具有最大高速缓存和最小磁盘片的最快旋转驱动器，仍然仍然会非常缓慢。


### How SSDs Are Different

> “If I had asked people what they wanted, they would have said faster horses.” — Henry Ford

Solid-state drives are called that specifically because they don’t rely on moving parts or spinning disks. Instead, data is saved to a pool of NAND flash. NAND itself is made up of what are called floating gate transistors. Unlike the transistor designs used in DRAM, which must be refreshed multiple times per second, NAND flash is designed to retain its charge state even when not powered up. This makes NAND a type of non-volatile memory.


### SSD与传统硬盘有何不同

>“如果我问人们他们想要什么，他们会说更快的马。” - 亨利·福特

之所以称其为固态驱动器，是因为它们不依赖移动部件或旋转磁盘。而是将数据保存到NAND闪存池中。 NAND本身由所谓的浮栅晶体管组成。与必须每秒刷新多次的DRAM中使用的晶体管设计不同，NAND闪存被设计为即使不加电也能保持其充电状态。这使得NAND成为一种非易失性存储器。


![Flash cell structure](http://www.extremetech.com/wp-content/uploads/2015/07/Flash_cell_structure.svg_1.png)

The diagram above shows a simple flash cell design. Electrons are stored in the floating gate, which then reads as charged “0” or not-charged “1.” Yes, in NAND flash, a 0 means data is stored in a cell — it’s the opposite of how we typically think of a zero or one. NAND flash is organized in a grid. The entire grid layout is referred to as a block, while the individual rows that make up the grid are called a page. Common page sizes are 2K, 4K, 8K, or 16K, with 128 to 256 pages per block. Block size therefore typically varies between 256KB and 4MB.

One advantage of this system should be immediately obvious. Because SSDs have no moving parts, they can operate at speeds far above those of a typical HDD. The following chart shows the access latency for typical storage mediums given in microseconds.

上图显示了一个简单的闪存单元设计。电子存储在浮栅中，然后浮栅被读取为带电的“ 0”或不带电的“ 1”。是的，在NAND闪存中，0表示数据存储在一个单元中–这与我们通常认为的零或一相反。 NAND闪存以网格形式组织。整个网格布局称为块，而组成网格的各个行称为页面。常见页面大小为2K，4K，8K或16K，每块128至256页。因此，块大小通常在256KB和4MB之间变化。

该系统的一个优点应该立即显而易见。由于SSD没有活动部件，因此它们可以以远远超过典型HDD的速度运行。下表显示了典型存储介质的访问延迟（以微秒为单位）。

![SSD-Latency](http://www.extremetech.com/wp-content/uploads/2015/07/SSD-Latency.png)]

> Image by [CodeCapsule](http://codecapsule.com/2014/02/12/coding-for-ssds-part-2-architecture-of-an-ssd-and-benchmarking/)

NAND is nowhere near as fast as main memory, but it’s multiple orders of magnitude faster than a hard drive. While write latencies are significantly slower for NAND flash than read latencies, they still outstrip traditional spinning media.

There are two things to notice in the above chart. First, note how adding more bits per cell of NAND has a significant impact on the memory’s performance. It’s worse for writes as opposed to reads — typical triple-level-cell (TLC) latency is 4x worse compared with single-level cell (SLC) NAND for reads, but 6x worse for writes. Erase latencies are also significantly impacted. The impact isn’t proportional, either — TLC NAND is nearly twice as slow as MLC NAND, despite holding just 50% more data (three bits per cell, instead of two).

NAND的速度远远不及主存，但比硬盘快几个数量级。 尽管NAND闪存的写入延迟比读取延迟要慢得多，但它们仍然超过了传统的旋转媒体。

上表中有两件事需要注意。 首先，请注意如何在每个NAND单元中增加更多位对存储器的性能有重大影响。 写操作比读操作更糟-读操作的典型三级单元（TLC）延迟比单级单元（SLC）NAND慢4倍，而写则要差6倍。 擦除等待时间也会受到很大影响。 影响也不是成比例的-尽管TLC NAND仅保留50％以上的数据（每个单元3位，而不是2位），但其速度几乎是MLC NAND的两倍。

![TLC NAND](http://www.extremetech.com/wp-content/uploads/2015/07/TLCNAND.png)]

> TLC NAND voltages

The reason TLC NAND is slower than MLC or SLC has to do with how data moves in and out of the NAND cell. With SLC NAND, the controller only needs to know if the bit is a 0 or a 1. With MLC NAND, the cell may have four values — 00, 01, 10, or 11. With TLC NAND, the cell can have eight values. Reading the proper value out of the cell requires the memory controller to use a precise voltage to ascertain whether any particular cell is charged.

TLC NAND比MLC或SLC慢的原因与数据如何进出NAND单元有关。 对于SLC NAND，控制器仅需要知道该位是0还是1。对于MLC NAND，该单元可以具有四个值-00、01、10或11。对于TLC NAND，该单元可以具有八个值。 。 从单元中读取适当的值需要存储器控制器使用精确的电压来确定是否对任何特定单元进行了充电。

### Reads, Writes, and Erasure

One of the functional limitations of [SSDs](http://www.extremetech.com/tag/ssds) is while they can read and write data very quickly to an empty drive, overwriting data is much slower. This is because while SSDs read data at the page level (meaning from individual rows within the NAND memory grid) and can write at the page level, assuming surrounding cells are empty, they can only erase data at the block level. This is because the act of erasing NAND flash requires a high amount of voltage. While you can theoretically erase NAND at the page level, the amount of voltage required stresses the individual cells around the cells that are being re-written. Erasing data at the block level helps mitigate this problem.

The only way for an SSD to update an existing page is to copy the contents of the entire block into memory, erase the block, and then write the contents of the old block + the updated page. If the drive is full and there are no empty pages available, the SSD must first scan for blocks that are marked for deletion but that haven’t been deleted yet, erase them, and then write the data to the now-erased page. This is why SSDs can become slower as they age — a mostly-empty drive is full of blocks that can be written immediately, a mostly-full drive is more likely to be forced through the entire program/erase sequence.

If you’ve used SSDs, you’ve likely heard of something called “garbage collection.” Garbage collection is a background process that allows a drive to mitigate the performance impact of the program/erase cycle by performing certain tasks in the background. The following image steps through the garbage collection process.

### 读取，写入和删除

[SSD]（http://www.extremetech.com/tag/ssds）的功能限制之一是它们可以非常快速地将数据读写到空驱动器上，而覆盖数据的速度要慢得多。这是因为尽管SSD在页面级别读取数据（意味着从NAND存储器网格中的各个行读取数据）并可以在页面级别写入数据（假设周围的单元为空），但它们只能在块级别擦除数据。这是因为擦除NAND闪存的操作需要大量电压。从理论上讲，您可以在页面级别擦除NAND，但所需的电压量使正在重写的单元周围的各个单元承受压力。在块级别擦除数据有助于缓解此问题。

SSD更新现有页面的唯一方法是将整个块的内容复制到内存中，擦除该块，然后写入旧块的内容+更新的页面。如果驱动器已满，并且没有可用的空页面，则SSD必须首先扫描标记为删除但尚未删除的块，将其擦除，然后将数据写入到现在擦除的页面中。这就是为什么SSD会随着使用时间的增长而变慢的原因-大多数为空的驱动器充满了可以立即写入的块，而大多数为空的驱动器更有可能在整个程序/擦除序列中被强制执行。

如果您使用过SSD，则可能听说过“垃圾收集”。垃圾回收是一个后台过程，它允许驱动器通过在后台执行某些任务来减轻程序/擦除周期的性能影响。下图逐步完成了垃圾收集过程。

![Garbage collection](http://www.extremetech.com/wp-content/uploads/2015/07/Diagram-1.png)

> Image courtesy of Wikipedia

Note in this example, the drive has taken advantage of the fact that it can write very quickly to empty pages by writing new values for the first four blocks (A’-D’). It’s also written two new blocks, E and H. Blocks A-D are now marked as stale, meaning they contain information the drive has marked as out-of-date. During an idle period, the SSD will move the fresh pages over to a new block, erase the old block, and mark it as free space. This means the next time the SSD needs to perform a write, it can write directly to the now-empty Block X, rather than performing the program/erase cycle.

The next concept I want to discuss is TRIM. When you delete a file from Windows on a typical hard drive, the file isn’t deleted immediately. Instead, the operating system tells the hard drive it can overwrite the physical area of the disk where that data was stored the next time it needs to perform a write. This is why it’s possible to undelete files (and why deleting files in Windows doesn’t typically clear much physical disk space until you empty the recycling bin). With a traditional HDD, the OS doesn’t need to pay attention to where data is being written or what the relative state of the blocks or pages is. With an SSD, this matters.

请注意，在此示例中，驱动器利用了以下事实：它可以通过为前四个块（A’-D’）写入新值来非常快地将其写入空白页。它还写入了两个新的块E和H。A-D块现在被标记为陈旧，这意味着它们包含驱动器已标记为过期的信息。在空闲期间，SSD会将新页面移至新块，擦除旧块，并将其标记为可用空间。这意味着SSD下次需要执行写操作时，可以直接写到当前为空的Block X，而无需执行编程/擦除周期。

我要讨论的下一个概念是TRIM。当您从Windows上的典型硬盘驱动器上删除文件时，该文件不会立即删除。相反，操作系统告诉硬盘驱动器它可以在下次需要执行写操作时覆盖磁盘上存储数据的物理区域。这就是为什么可以取消删除文件的原因（以及为什么在Windows中删除文件通常不会清空大量物理磁盘空间，除非清空回收站）。使用传统的硬盘驱动器，操作系统无需注意写入数据的位置或块或页面的相对状态。对于SSD，这很重要。

The TRIM command allows the operating system to tell the SSD it can skip rewriting certain data the next time it performs a block erase. This lowers the total amount of data the drive writes and increases SSD longevity. Both reads and writes damage NAND flash, but writes do far more damage than reads. Fortunately, block-level longevity has not proven to be an issue in modern NAND flash. More data on [SSD longevity](http://www.extremetech.com/computing/201064-which-ssds-are-the-most-reliable-massive-study-sheds-some-light), courtesy of the Tech Report, can be found here.

The last two concepts we want to talk about are wear leveling and write amplification. Because SSDs write data to pages but erase data in blocks, the amount of data being written to the drive is always larger than the actual update. If you make a change to a 4KB file, for example, the entire block that 4K file sits within must be updated and rewritten. Depending on the number of pages per block and the size of the pages, you might end up writing 4MB worth of data to update a 4KB file. Garbage collection reduces the impact of write amplification, as does the TRIM command. Keeping a significant chunk of the drive free and/or manufacturer over-provisioning can also reduce the impact of write amplification.

Wear leveling refers to the practice of ensuring certain NAND blocks aren’t written and erased more often than others. While wear leveling increases a drive’s life expectancy and endurance by writing to the NAND equally, it can actually increase write amplification. In other to distribute writes evenly across the disk, it’s sometimes necessary to program and erase blocks even though their contents haven’t actually changed. A good wear leveling algorithm seeks to balance these impacts.


TRIM命令允许操作系统告诉SSD在下次执行块擦除时可以跳过重写某些数据。这样可以减少驱动器写入的数据总量，并提高SSD的使用寿命。读取和写入都会损坏NAND闪存，但是写入所造成的损坏远大于读取。幸运的是，在现代NAND闪存中，块级寿命尚未被证明是一个问题。有关[SSD寿命]的更多数据（http://www.extremetech.com/computing/201064-which-ssds-are-the-most-reliable-massive-study-sheds-some-light），由技术报告提供，可以在这里找到。

我们要讨论的最后两个概念是损耗均衡和写入放大。由于SSD将数据写入页面，但以块为单位擦除数据，因此写入驱动器的数据量始终大于实际更新量。例如，如果更改了4KB文件，则必须更新并重写4K文件所在的整个块。根据每个块的页面数和页面大小，最终可能要写入4MB的数据来更新4KB的文件。垃圾收集可减少写入放大的影响，TRIM命令也是如此。保持大量驱动器空闲和/或制造商过度配置还可以减少写放大的影响。

损耗均衡是指确保某些NAND块不比其他块更频繁地写入和擦除的做法。通过平均写入NAND损耗平均可以提高驱动器的预期寿命和耐用性，但实际上可以增加写入放大率。另一种方法是在磁盘上平均分配写入数据，有时甚至需要对块进行编程和擦除，即使它们的内容并未真正更改。良好的磨损均衡算法旨在平衡这些影响。


### The SSD Controller

It should be obvious by now SSDs require much more sophisticated control mechanisms than hard drives do. That’s not to diss magnetic media — I actually think HDDs deserve more respect than they are given. The mechanical challenges involved in balancing multiple read-write heads nanometers above platters that spin at 5,400 to 10,000 RPM are nothing to sneeze at. The fact that HDDs perform this challenge while pioneering new methods of recording to magnetic media and eventually wind up selling drives at 3-5 cents per gigabyte is simply incredible.

### SSD主控

显而易见，与硬盘驱动器相比，SSD现在需要更加复杂的控制机制。 那并不是要散播磁性媒体-实际上，我认为HDD应该得到更多的尊重。 平衡以高于5,400 RPM至10,000 RPM旋转的盘片以上的多个纳米读写头所涉及的机械难题无济于事。 HDD在开创磁介质记录新方法并最终以每GB 3-5美分的价格出售驱动器的同时，还面临着这一挑战，这简直令人难以置信。

![SSD controller](http://www.extremetech.com/wp-content/uploads/2015/07/2006640.jpg)

> A typical SSD controller

SSD controllers, however, are in a class by themselves. They often have a DDR3 memory pool to help with managing the NAND itself. Many drives also incorporate single-level cell caches that act as buffers, increasing drive performance by dedicating fast NAND to read/write cycles. Because the NAND flash in an SSD is typically connected to the controller through a series of parallel memory channels, you can think of the drive controller as performing some of the same load balancing work as a high-end storage array — SSDs don’t deploy RAID internally but wear leveling, garbage collection, and SLC cache management all have parallels in the big iron world.

Some drives also use data compression algorithms to reduce the total number of writes and improve the drive’s lifespan. The SSD controller handles error correction, and the algorithms that control for single-bit errors have become increasingly complex as time has passed.

Unfortunately, we can’t go into too much detail on SSD controllers because companies lock down their various secret sauces. Much of NAND flash’s performance is determined by the underlying controller, and companies aren’t willing to lift the lid too far on how they do what they do, lest they hand a competitor an advantage.

但是，SSD控制器本身就是一类。他们通常有一个DDR3内存池来帮助管理NAND本身。许多驱动器还集成了用作缓冲区的单级单元高速缓存，通过将快速NAND专用于读/写周期来提高驱动器性能。由于SSD中的NAND闪存通常通过一系列并行内存通道连接到控制器，因此您可以认为驱动器控制器执行与高端存储阵列相同的负载均衡工作-SSD不部署内部具有RAID，但损耗均衡，垃圾收集和SLC缓存管理在大型钢铁世界中具有相似之处。

某些驱动器还使用数据压缩算法来减少写入总数并提高驱动器的使用寿命。 SSD控制器负责纠错，随着时间的流逝，控制单位错误的算法变得越来越复杂。

不幸的是，由于公司锁定了他们的各种秘密武器，因此我们无法对SSD控制器进行过多的详细介绍。 NAND闪存的大部分性能由底层控制器决定，并且公司不愿将自己的工作方式抬高，以免给竞争对手带来优势。

### The Road Ahead

NAND flash offers an enormous improvement over hard drives, but it isn’t without its own drawbacks and challenges. Drive capacities and price-per-gigabyte are expected to continue to rise and fall respectively, but there’s little chance SSDs will catch hard drives in price-per-gigabyte. Shrinking process nodes are a significant challenge for NAND flash — while most hardware improves as the node shrinks, NAND becomes more fragile. Data retention times and write performance are intrinsically lower for 20nm NAND than 40nm NAND, even if data density and total capacity are vastly improved.

Thus far, SSD manufacturers have delivered better performance by offering faster data standards, more bandwidth, and more channels per controller — plus the use of SLC caches we mentioned earlier. Nonetheless, in the long run, it’s assumed NAND will be replaced by something else.

### 发展前景

NAND闪存比硬盘具有巨大的进步，但并非没有缺点和挑战。 驱动器容量和每GB的价格预计将分别继续上升和下降，但是SSD很难以每GB的价格捕获硬盘。 工艺节点的缩小对于NAND闪存来说是一个巨大的挑战-虽然大多数硬件会随着节点的缩小而提高，但NAND变得更加脆弱。 即使大大提高了数据密度和总容量，20nm NAND的数据保留时间和写入性能本质上也比40nm NAND低。

到目前为止，SSD制造商通过提供更快的数据标准，更多的带宽和每个控制器更多的通道，以及我们前面提到的SLC缓存的使用，已经提供了更好的性能。 尽管如此，从长远来看，人们认为NAND将被其他产品取代。

What that something else will look like is still open for debate. Both [magnetic RAM](http://www.extremetech.com/computing/193065-mram-manufacturer-everspin-teams-up-with-globalfoundries-to-build-magnetic-memory) and [phase change memory](http://www.extremetech.com/extreme/182096-ibm-demonstrates-next-gen-phase-change-memory-thats-up-to-275-times-faster-than-your-ssd) have presented themselves as candidates, though both technologies are still in early stages and must overcome significant challenges to actually compete as a replacement to NAND. Whether consumers would notice the difference is an open question. If you’ve upgraded from NAND to an SSD and then upgraded to a faster SSD, you’re likely aware the gap between HDDs and SSDs is much larger than the SSD-to-SSD gap, even when upgrading from a relatively modest drive. Improving access times from milliseconds to microseconds matters a great deal, but improving them from microseconds to nanoseconds might fall below what humans can really perceive in most cases.

Intel’s 3D XPoint (marketed as Intel Optane) has emerged as one potential challenger to NAND flash, and the only current alternative technology in mainstream production. Optane SSDs offer similar sequential performance to current NAND flash drives, but with vastly better performance at low drive queues. Drive latency is also roughly half of NAND flash (10 microseconds, versus 20) and vastly higher endurance (30 full drive-writes per day, compared with 10 full drive writes per day for a high-end Intel SSD).

其他事物的外观仍需进行辩论。 [磁性RAM]（http://www.extremetech.com/computing/193065-mram-manufacturer-everspin-teams-up-with-globalfoundries-to-build-magnetic-Memory）和[相变存储器]（http ：//www.extremetech.com/extreme/182096-ibm-demonstrates-next-gen-phase-change-memory-thats-up-to-275-times-faster-than-your-ssd）已作为候选人提出来，尽管这两种技术仍处于早期阶段，必须克服重大挑战才能真正替代NAND竞争。消费者是否会注意到差异是一个悬而未决的问题。如果您已从NAND升级到SSD，然后又升级到了更快的SSD，则即使从相对适中的驱动器进行升级，HDD和SSD之间的距离也可能远远大于SSD到SSD的距离。将访问时间从毫秒提高到毫秒非常重要，但是在大多数情况下，将访问时间从毫秒提高到纳秒可能不及人类真正的能力。

英特尔的3D XPoint（以Intel Optane销售）已成为NAND闪存的潜在挑战者，并且是主流生产中当前唯一的替代技术。 Optane SSD具有与当前NAND闪存驱动器相似的顺序性能，但在低驱动器队列时具有更好的性能。驱动器延迟也大约是NAND闪存的一半（10微秒，而不是20微秒），并且耐久性更高（每天30次完整驱动器写入，而高端Intel SSD每天10次完整驱动器写入）。

![Optane1](https://www.extremetech.com/wp-content/uploads/2016/10/Optane1.png)

> Intel Optane performance targets

The first [Optane SSDs](https://www.extremetech.com/computing/265254-intel-launches-new-optane-800p-m-2-ssds-consumer-systems) have debuted as excellent add-ons for Kaby Lake and Coffee Lake. Still, Optane is still too expensive to match NAND flash, which benefits from substantial economies of scale, but this could change in the future. NAND will stay king of the hill for at least the next 3-4 years. But past that point we could see Optane starting to replace it in volume, depending on how Intel and Micron scale the technology and how well 3D NAND flash continues to expand its cell layers (64-layer NAND is shipping from multiple players), with roadmaps for 96 and even 128 layers on the horizon.

Check out our [ExtremeTech Explains](http://www.extremetech.com/tag/extremetech-explains) series for more in-depth coverage of today’s hottest tech topics.

首批[Optane SSD]（https://www.extremetech.com/computing/265254-intel-launches-new-optane-800p-m-2-ssds-consumer-systems）作为Kaby的出色附加组件首次亮相 湖和咖啡湖。 尽管如此，Optane仍然太昂贵以至于无法与NAND闪存匹敌，而NAND闪存得益于规模经济，但这种情况将来可能会改变。 在接下来的3-4年中，NAND将继续保持领先地位。 但是到那时，我们可以看到Optane开始大量取代它，这取决于英特尔和美光科技如何扩展技术以及3D NAND闪存继续扩展其单元层的能力（64层NAND正在从多个厂商出货）。 在地平线上可以覆盖96甚至128层

请查看我们的[ExtremeTech Explains]（http://www.extremetech.com/tag/extremetech-explains）系列，以更深入地介绍当今最热门的技术主题。

## 更多链接


- [The Worst CPUs Ever Built](https://www.extremetech.com/computing/274650-the-worst-cpus-ever-made)
- [Happy 40th Anniversary to the Original Intel 8086](https://www.extremetech.com/computing/270926-happy-40th-anniversary-to-the-original-8086-and-the-x86-architecture)
- [The Myths of Moore’s Law](https://www.extremetech.com/extreme/223022-the-myths-of-moores-law)



- 英文版本: [How Do SSDs Work?](https://www.extremetech.com/extreme/210492-extremetech-explains-how-do-ssds-work)
