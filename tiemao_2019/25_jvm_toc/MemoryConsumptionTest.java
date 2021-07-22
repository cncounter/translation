package com.cnc;

/**
 *
 */
public class MemoryConsumptionTest {


    public static class BaseId {
        protected long id;
    }
    public static class User extends BaseId{
        protected int age;
    }
    public static class VipUser extends User{
        protected boolean validState;
    }
    public static class SvipUser extends VipUser{
        protected int vipLevel;
    }
}
