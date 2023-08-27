# Java程序中支持环境变量配置取值的代码


Spring的配置文件支持环境变量以及系统属性, 格式为 `${propName}`, 还支持默认值设置 `${propName: defultValue}`。

因为某些原因, 需要配置中支持从环境变量取值, 下面是我们的代码实现:



```java

import org.apache.commons.lang3.StringUtils;
/*

支持在配置中读取环境变量

测试时, 启动前需要设置以下环境变量:

WHOLE_JDBC_URL="jdbc:mysql://localhost:3323/cnc_web?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8&useUnicode=yes"
JDBC_URL_HOST_PORT="localhost:3323"
JDBC_URL_DB="cnc_web"

 */

public class EnvUtilsTest {
    // 测试代码
    public static void main(String[] args) {
        //
        final String JDBC_URL = "jdbc:mysql://localhost:3323/cnc_web?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8&useUnicode=yes";
        //
        String WHOLE_JDBC_URL = "WHOLE_JDBC_URL";
        String JDBC_URL_HOST_PORT = "JDBC_URL_HOST_PORT";
        String JDBC_URL_DB = "JDBC_URL_DB";
        //
        String[] configs = {
                "${WHOLE_JDBC_URL}",
                "jdbc:mysql://${JDBC_URL_HOST_PORT}/cnc_web?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8&useUnicode=yes",
                "jdbc:mysql://${JDBC_URL_HOST_PORT}/${JDBC_URL_DB}?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8&useUnicode=yes",
                "jdbc:mysql://${JDBC_URL_HOST_PORT}/${JDBC_URL_DB}?useSSL=${USE_SSL: false}&serverTimezone=UTC&characterEncoding=UTF-8&useUnicode=yes",
        };

        for (String config : configs) {
            String target = fillEnv(config);
            if (JDBC_URL.equals(target)) {
                System.out.println("正常!====");
            } else {
                System.out.println("!!!!!!======不一致：");
                System.out.println("target= " + target);
            }
        }

    }


    // 处理系统环境变量: 支持在配置中读取环境变量
    // 支持的形式: ${JDBC_URL_HOST_PORT} 以及 ${USE_SSL: false}
    public static String fillEnv(String value) {
        try {
            return _fillEnv(value);
        } catch (Exception ignore) {
            return value;
        }
    }

    private static String _fillEnv(String value) {
        if (null == value || StringUtils.isEmpty(value)) {
            return value;
        }
        //
        final String startChar = "${";
        final String endChar = "}";
        final String colonChar = ":";
        //
        String targetValue = value;
        while (targetValue.contains(startChar) && targetValue.contains(endChar)) {
            //
            int indexStart = targetValue.indexOf(startChar);
            int indexEnd = targetValue.indexOf(endChar, indexStart);
            if (indexEnd <= indexStart) {
                break;
            }
            String envName = targetValue.substring(indexStart + startChar.length(), indexEnd);
            // 默认值
            String defaultEnvValue = "";
            if (envName.contains(colonChar)) {
                int index0 = envName.indexOf(colonChar);
                defaultEnvValue = envName.substring(index0 + 1).trim();
                envName = envName.substring(0, index0).trim();
            }
            envName = envName.trim();
            String envValue = System.getenv(envName);
            if (null == envValue) {
                envValue = defaultEnvValue;
            }
            //
            String prev = targetValue.substring(0, indexStart);
            String next = targetValue.substring(indexEnd + endChar.length());
            targetValue = prev + envValue + next;
        }

        return targetValue;
    }
}

```