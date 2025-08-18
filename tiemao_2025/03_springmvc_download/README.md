# SpringMVC怎么实现一个文件下载器



```java
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Controller
public class FileDownloadController {


    // 下载普通文件
    @GetMapping(value = "/download/filePath",
      produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<Resource> downloadFile(
               @RequestParam("path") String path, 
               @RequestParam(value = "filename", required = false) String filename
             )throws Exception {
        // 必须做好安全限制; 根据系统规划来确定
        if (null == path || path.startsWith(".") || path.startsWith("/") || path.contains("./")) {
            throw new RuntimeException("非法访问");
        }
        // 给浏览器建议的文件名
        if (null == filename || filename.isEmpty()) {
            filename = path.substring(path.lastIndexOf("/") + 1);
        }
        //
        InputStream inputStream = new FileInputStream(path);
        // 根据需要确定使用哪种方法, 转换为数组不容易出错, 但是消耗内存;
        // byte[] byteArray = classPathResource.getContentAsByteArray();
        // long length = byteArray.length;
        long length = inputStream.available();

        InputStreamResource resource = new InputStreamResource(inputStream);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + new String(filename.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1))
                .contentLength(length).contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }


    // 下载类路径中的资源
    @GetMapping(value = "/download/classpathResource", 
      produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<Resource> (
               @RequestParam("path") String path, 
               @RequestParam(value = "filename", required = false) String filename
             )throws Exception {
        // 必须做好安全限制; 根据系统规划来确定
        if (null == path || path.startsWith(".") || path.contains("./")) {
            throw new RuntimeException("非法访问");
        }
        if (path.endsWith(".class") || path.endsWith(".jar") || path.endsWith(".xml")) {
            throw new RuntimeException("非法访问");
        }
        // 给浏览器建议的文件名
        if (null == filename || filename.isEmpty()) {
            filename = path.substring(path.lastIndexOf("/") + 1);
        }
        ClassPathResource classPathResource = new ClassPathResource(path);
        InputStream inputStream = classPathResource.getInputStream();
        long length = inputStream.available();

        InputStreamResource resource = new InputStreamResource(inputStream);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + new String(filename.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1))
                .contentLength(length).contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
```

