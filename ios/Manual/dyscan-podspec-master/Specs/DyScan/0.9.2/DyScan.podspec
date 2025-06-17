Pod::Spec.new do |s|
    s.name         = "DyScan"
    s.version      = "0.9.2"
    s.summary      = "Credit Card Scanning SDK"
    s.description  = <<-DESC
    DyScan allows users to enter payment information more quickly, reducing friction in the checkout process.
    DESC
    s.homepage     = "https://dyneti.com"
    s.license = { :type => 'Copyright', :text => <<-LICENSE
                   Copyright Dyneti Technologies, Inc. 2019
                  LICENSE
                }
    s.author             = { "Dyneti" => "support@dyneti.com" }
    s.source       = { :git => "https://github.com/Dyneti/dyscan-ios-distribution.git", :tag => "#{s.version}" }

    s.platform = :ios
    s.ios.deployment_target  = '9.0'
    s.weak_frameworks = 'Foundation','UIKit','AVFoundation'

    s.subspec '4.2' do |a|
        a.public_header_files = "Swift4_2/DyScan.framework/Headers/*.h"
        a.source_files = "Swift4_2/DyScan.framework/Headers/*.h"
        a.vendored_frameworks = "Swift4_2/DyScan.framework"
        a.resources = 'Swift4_2/DyScan.framework/Assets/*'
    end

    s.subspec '5.0' do |b|
        b.public_header_files = "Swift5/DyScan.framework/Headers/*.h"
        b.source_files = "Swift5/DyScan.framework/Headers/*.h"
        b.vendored_frameworks = "Swift5/DyScan.framework"
        b.resources = 'Swift5/DyScan.framework/Assets/*'
    end

    s.subspec '5.1' do |e|
        e.public_header_files = "Swift5_1/DyScan.framework/Headers/*.h"
        e.source_files = "Swift5_1/DyScan.framework/Headers/*.h"
        e.vendored_frameworks = "Swift5_1/DyScan.framework"
        e.resources = 'Swift5_1/DyScan.framework/Assets/*'
    end

    s.subspec '4.2_eu' do |c|
        c.public_header_files = "Swift4_2_eu/DyScan.framework/Headers/*.h"
        c.source_files = "Swift4_2_eu/DyScan.framework/Headers/*.h"
        c.vendored_frameworks = "Swift4_2_eu/DyScan.framework"
        c.resources = 'Swift4_2_eu/DyScan.framework/Assets/*'
    end

    s.subspec '5.0_eu' do |d|
        d.public_header_files = "Swift5_eu/DyScan.framework/Headers/*.h"
        d.source_files = "Swift5_eu/DyScan.framework/Headers/*.h"
        d.vendored_frameworks = "Swift5_eu/DyScan.framework"
        d.resources = 'Swift5_eu/DyScan.framework/Assets/*'
    end

    s.subspec '5.1_eu' do |f|
        f.public_header_files = "Swift5_1_eu/DyScan.framework/Headers/*.h"
        f.source_files = "Swift5_1_eu/DyScan.framework/Headers/*.h"
        f.vendored_frameworks = "Swift5_1_eu/DyScan.framework"
        f.resources = 'Swift5_1_eu/DyScan.framework/Assets/*'
    end

end
