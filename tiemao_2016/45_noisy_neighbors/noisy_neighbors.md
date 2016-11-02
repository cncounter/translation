# Eliminating Noisy Neighbors in the Public Cloud

An IaaS provider is using all-SSD arrays and storage QoS to ensure that some tenants can’t disrupt performance of others by overconsuming resources.

One problem with multitenant public cloud environments is the "noisy neighbor" phenomenon, when one or more customers monopolize available resources and thus significantly degrade the performance of other customers' systems.

One way to address this problem is via storage-based quality of service that provides defined service levels to all tenants. An infrastructure-as-a-service provider, CloudSigma, is using all-SSD arrays from SolidFire to create an architecture to eliminate noisy neighbors.

CloudSigma has decided to replace all of its Tier 1 primary storage hard disk arrays with SolidFire all-SSD arrays. In addition to this significant move, the company also offers solid-state drive storage at the same price as hard disk for the same capacity. How can CloudSigma do this when flash memory is more expensive on a per-unit basis than hard disk?

An all-flash array can have better economics than an all-disk storage array in private data centers when taking into account the total system, including servers, storage and software (especially software licensing costs), as attested to by IBM based on a Wikibon study. IaaS does not have all the software licensing cost advantage, but CloudSigma overcomes the loss leader costs of storage by selling more compute cycles.

CloudSigma's profit margins on consumption of computing resources are greater than that of storage. Key customers, such as big science in Europe and big media in the United States, have burst requirements. Being able to house all of a big data set on SSD improves performance, which means things get done in a more timely (that is, valuable) manner, and the compute fees go to CloudSigma instead of to a competitor.

But the burst requirements of some customers may create noisy-neighbor problems for subscription customers with more traditional storage provisioning needs. CloudSigma needed an SSD-array supplier that could solve this noisy-neighbor QoS problem, and so it turned to SolidFire.

Solving the Noisy-Neighbor Problem

With an IT product like a storage array, architecture encompasses both the hardware and software components that give the product its character and style. For example, an enterprise-class disk array is more than a just-a-bunch-of-disks offering. Among other features, it contains a controller that has one or more processors running a specialized operating system and software algorithms that manage RAM cache to improve overall performance.

SolidFire's SF3010 and SF6010 appliances are controller-less, all-flash arrays where one node is 1U high, for an effective capacity of 12 Tbytes (with 10 128-Gbyte drives in an SF3010) and 24 Tbytes (with 256-Gbyte drives in an SF6010). The company's scale-out clustered architecture enables a single cluster of appliances to scale to more than 2 petabytes of effective capacity.

But the true power of SolidFire resides in its Element operating system, which manages all the functions of the array. That includes SolidFire Helix data protection to manage device failure without performance impact (a key element in meeting QoS commitments). SolidFire software also offers thin provisioning, deduplication and compression to get the most out of the available storage. For example, thin provisioning is necessary for elasticity in the cloud as allocated, but not-yet-used system resources, such as IOPS and gigabytes, can be made available on demand for peak load (that is, burst) requirements.

In a CloudSigma cloud, customers purchase both the gigabytes and IOPS necessary for a guaranteed minimum performance level for applications as a whole (and not just for the 5% of data that is traditionally considered performance-sensitive). This delivers predictable performance, but also means that SolidFire has to have some mechanisms that eliminate potential noisy-neighbor threats. The company achieves this through balanced load distribution, which eliminates hot spots that create unpredictable latency and performance virtualization that enables on-demand control of performance independent of capacity, as well as fine-grain volume control.

Key to all this is the use of a REST-based API that delivers multitenant provisioning, reporting and performance isolation. The key word is "isolation." Each cloud tenant needs to be assured that its reserved resources will be available as guaranteed. That means SolidFire has to find the necessary physical resources when they are needed, even though the customer has been allocated resources on a physical basis.

Altogether, SolidFire delivers not only predictable performance but also the necessary reliability, data protection and security characteristics that enable the running of business- and mission-critical applications. Though a number of enterprises might not want to entrust those systems to a public cloud, SolidFire's offerings make that decision based on reasons other than technology considerations. And CloudSigma's customer base, which includes CERN (a stickler when it comes to technology and security requirements), would argue that not everyone feels that way.

Note also that the level of guaranteed QoS SolidFire promises is difficult, if not impossible, to achieve with all-hard disk arrays, mainly because they are electromechanical products versus an all-electronic SSD array. Rather than getting into details, suffice to say that managing available IOPS is more straightforward with SSDs than with hundreds or thousands of moving actuator arms. And that's one reason that all-flash arrays will eventually prevail over all-disk arrays when QoS is a strict requirement.

Mesabi Musings

The IT industry does not officially declare "The Year of..." awards, but if it did for storage, 2013 might be called "The Year of All-Flash Arrays." IBM in its recently announced flash initiative stood as a "Good Housekeeping Seal of Approval" for all-flash arrays in data centers based on a purely economic analysis.

CloudSigma and SolidFire have extended that point to public cloud infrastructures. In a multitenant cloud, economics is a critically important consideration, of course, but so is being able to provide a guaranteed QoS. Without predictable performance (and that's not just for performance-sensitive data, but all data on a day-to-day basis), customers cannot commit to a public cloud.

SolidFire eliminates the noisy-neighbor QoS problem, and CloudSigma attests to the technical and economical value of this approach with its full commitment to all-SSD SolidFire arrays for primary storage. To achieve this, SolidFire has created a sophisticated architecture that provides differentiation in the same sense that an enterprise-class disk array is much more than just a bunch of disks. From an economic performance and QoS manageability perspective, all-flash arrays now command the high ground for Tier 1 primary storage arrays.

We all knew that flash's time was coming; what should be apparent to all is that time is now.

Neither CloudSigma nor SolidFire is a client of David Hill and the Mesabi Group.



http://www.networkcomputing.com/storage/eliminating-noisy-neighbors-public-cloud/22442379/page/0/1


http://www.ithome.com/html/it/267407.htm

http://searchcloudcomputing.techtarget.com/definition/noisy-neighbor-cloud-computing-performance


