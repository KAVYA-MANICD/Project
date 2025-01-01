//package com.example.Invoice.API.Modal;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Data
//@Entity
//@Table(name = "pinvoice")
//public class PInvoice {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String companyName;
//    private String companyAddress;
//
//    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Payroll> payrolls = new ArrayList<>();
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getCompanyName() {
//        return companyName;
//    }
//
//    public void setCompanyName(String companyName) {
//        this.companyName = companyName;
//    }
//
//    public String getCompanyAddress() {
//        return companyAddress;
//    }
//
//    public void setCompanyAddress(String companyAddress) {
//        this.companyAddress = companyAddress;
//    }
//
//    public List<Payroll> getPayrolls() {
//        return payrolls;
//    }
//
//    public void setPayrolls(List<Payroll> payrolls) {
//        this.payrolls = payrolls;
//    }
//}
