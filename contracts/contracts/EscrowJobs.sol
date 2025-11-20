// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract EscrowJobs {
    using SafeERC20 for IERC20;

    enum JobStatus {
        Created,
        Funded,
        Assigned,
        Released
    }

    struct Job {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;
        address token;
        JobStatus status;
    }

    mapping(uint256 => Job) public jobs;
    uint256 public jobCount;

    event JobCreated(uint256 indexed jobId, address indexed client, uint256 amount, address token);
    event JobFunded(uint256 indexed jobId, address indexed client, uint256 amount);
    event JobAssigned(uint256 indexed jobId, address indexed freelancer);
    event PaymentReleased(uint256 indexed jobId, address indexed freelancer, uint256 amount);

    function createJob(uint256 jobId, uint256 amount, address token) external {
        require(jobs[jobId].id == 0, "Job already exists");
        require(amount > 0, "Amount must be greater than 0");
        require(token != address(0), "Invalid token address");

        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            freelancer: address(0),
            amount: amount,
            token: token,
            status: JobStatus.Created
        });

        jobCount++;
        emit JobCreated(jobId, msg.sender, amount, token);
    }

    function fundJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.id != 0, "Job does not exist");
        require(job.client == msg.sender, "Only client can fund");
        require(job.status == JobStatus.Created, "Job already funded");

        IERC20 token = IERC20(job.token);
        token.safeTransferFrom(msg.sender, address(this), job.amount);

        job.status = JobStatus.Funded;
        emit JobFunded(jobId, msg.sender, job.amount);
    }

    function assignFreelancer(uint256 jobId, address freelancer) external {
        Job storage job = jobs[jobId];
        require(job.id != 0, "Job does not exist");
        require(job.client == msg.sender, "Only client can assign");
        require(job.status == JobStatus.Funded, "Job must be funded first");
        require(freelancer != address(0), "Invalid freelancer address");

        job.freelancer = freelancer;
        job.status = JobStatus.Assigned;
        emit JobAssigned(jobId, freelancer);
    }

    function releasePayment(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.id != 0, "Job does not exist");
        require(job.client == msg.sender, "Only client can release");
        require(job.status == JobStatus.Assigned, "Job must be assigned");
        require(job.freelancer != address(0), "No freelancer assigned");

        IERC20 token = IERC20(job.token);
        token.safeTransfer(job.freelancer, job.amount);

        job.status = JobStatus.Released;
        emit PaymentReleased(jobId, job.freelancer, job.amount);
    }
}

